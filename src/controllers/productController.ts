import type { Request, Response } from "express";
import {
  baseVariantSchema,
  productSchema,
  variantSchema,
} from "../schema/variantSchema";
import Product from "../models/Product";
import Variant from "../models/Variant";
import BadRequest from "../errors/badRequest";
import type { JSONRequest } from "../types/AppRequest";
import z from "zod";
import mongoose from "mongoose";
import cache from "../libs/cache";
import { ca } from "zod/locales";

/*
 * Get all products
 */
export const getAllProducts = async (req: Request, res: Response) => {
  const data = await Product.find();
  res.json(data);
};

/**
 * Get all item sales from database
 */
export const getProducts = async (req: Request, res: Response) => {
  const query = req.query;
  let skip = 0;
  let limit = 10;
  let sort = "";
  let category = "";
  if (query.limit) {
    limit = parseInt(query.limit as string, 10);
  }
  if (query.skip) {
    skip = parseInt(query.skip as string, 10);
  }
  if (query.sort) {
    sort = query.sort as string;
  }

  if (query.category) {
    category = query.category as string;
  }

  if (query.price && sort == "") {
    const key = `products_price_${query.price}_${category}_${skip}_${limit}`;
    if (cache.has(key)) {
      return res.json(cache.get(key));
    }

    let prefixFilters = [
      {
        $match: {
          price: { $lte: Number(query.price) * 100 },
        },
      },
      { $sort: { price: -1 } },
      {
        $group: {
          _id: "$productId",
          variants: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          variants: 1,
          productId: "$_id",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $addFields: {
          product: { $arrayElemAt: ["$product", 0] },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$$ROOT", "$product"] },
        },
      },
      {
        $match: {
          isReadyForSale: true,
        },
      },
    ];

    // Add category filter if needed (dynamic)
    if (category && category !== "all") {
      prefixFilters.push({
        $match: {
          // @ts-ignore
          categories: { $in: [category] },
        },
      });
    }

    // NOW add $facet for data + count (replaces your skip/limit/project pushes)
    prefixFilters.push({
      // @ts-ignore
      $facet: {
        data: [
          // @ts-ignore
          { $skip: skip },
          // @ts-ignore
          { $limit: limit },
          {
            $project: {
              // @ts-ignore
              product: 0,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const items = await Variant.aggregate(prefixFilters as any);

    const output = {
      data: items[0]?.data || [],
      limit: limit,
      skip: skip,
      total: items[0].total[0]?.count || 0,
    };

    // save to cache for 1 hour
    cache.set(key, output, 3600);

    return res.json(output);
  }

  const total = await Product.countDocuments();

  const searchPattern = {
    $match: {
      isReadyForSale: true,
      categories: {
        $in: [category],
      } as any,
    },
  };

  if (category === "all" || !category) {
    // @ts-ignore
    delete searchPattern.$match.categories;
  }

  const items = await Product.aggregate([
    searchPattern,
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "productId",
        as: "variants",
      },
    },
  ]);
  res.json({
    data: items,
    limit: limit,
    skip: skip,
    total: total,
  });
};
/**
 * Create a new item
 */
export const createProduct = async (req: Request, res: Response) => {
  const body = req.body;

  // validate the item
  const product = productSchema.safeParse(body?.product);

  if (!product.success) {
    throw product.error;
  }

  try {
    const savedItem = await Product.create({
      ...product.data,
      isReadyForSale: false,
    });

    res.status(201).json(savedItem);
  } catch (error) {
    throw error;
  }
};

/**
 * Get product by id
 */
export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.productId;
  const item = await Product.findById(id);
  res.json(item);
};
/**
 * Get all variants with product id
 */
export const getProductVariants = async (req: Request, res: Response) => {
  const id = req.params.productId;
  const item = await Variant.find({ productId: id });
  res.json(item);
};

/**
 * Create variants
 */
export const createVariants = async (req: Request, res: Response) => {
  const body = req.body;
  const productId = req.params.productId;
  const variants = variantSchema.safeParse(body);
  if (!variants.success) {
    throw new BadRequest(variants.error.issues[0]?.message);
  }

  const variantExit = await Variant.countDocuments({
    productId: productId,
    size: { $in: [variants.data.size] },
    color: { $in: [variants.data.color] },
  });

  if (variantExit > 0) {
    throw new BadRequest("Variant already exist");
  }

  const variantToSave = {
    ...variants.data,
    productId: productId,
  };
  const doc = await Variant.insertOne(variantToSave);
  res.json({ data: doc });
};
/**
 * Update product detail
 */
export const updateProductDetail = async (req: Request, res: Response) => {
  const id = req.params.productId;
  const body = req.body;
  const product = productSchema.safeParse(body);
  if (!product.success) {
    throw new BadRequest(product.error.issues[0]?.message);
  }
  await Product.findByIdAndUpdate(id, product.data, {
    new: true,
  });
  res.json({ msg: "ok" });
};

/**
 * Delete variant
 */
export const deleteVariant = async (req: Request, res: Response) => {
  const variantId = req.params.variantId;
  await Variant.findByIdAndDelete(variantId);
  res.json({ msg: "ok" });
};
/**
 * Update inventory
 */
export const updateInventory = async (
  req: JSONRequest<z.infer<typeof baseVariantSchema>>,
  res: Response,
) => {
  const variantId = req.params.variantId;

  await Variant.findByIdAndUpdate(variantId, req.data, {
    new: true,
  });

  res.json({ msg: "ok" });
};

// Get list of products with variant
export const getListProductWithVariant = async (
  req: Request,
  res: Response,
) => {
  const productId = req.params.productId;
  const data = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "productId",
        as: "variants",
      },
    },
  ]);

  res.json(data[0]);
};

// Get all categories from database
export const getAllCategories = async (req: Request, res: Response) => {
  const data = await Product.aggregate([
    {
      $unwind: "$categories",
    },
    {
      $group: {
        _id: "null",
        allCategories: {
          $addToSet: "$categories",
        },
      },
    },
  ]);
  res.json(data[0].allCategories);
};

export const getFeatureProduct = async (req: Request, res: Response) => {
  const featureProductId = [
    "6956cfa0558fc42863d3b97d",
    "695782bbc6f53ccfc2959e72",
    "696146062fdc5241821892cc",
    "6961c8494b66f352c26d6855",
    "6993fe8571a76b1b907dc2cf",
  ];

  const items = await Promise.all(
    featureProductId.map(async (id) => {
      const item = await Product.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "variants",
            localField: "_id",
            foreignField: "productId",
            as: "variants",
          },
        },
      ]);
      return item[0];
    }),
  );

  res.json(items);
};
