import { Router, type Request, type Response } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductVariants,
  createVariants,
  updateProductDetail,
  deleteVariant,
  updateInventory,
  getAllProducts,
  getListProductWithVariant,
  getAllCategories,
  getFeatureProduct,
} from "../controllers/productController";
import { validateInputMiddleware } from "../middlewares/validateInputMiddleware";
import { baseVariantSchema } from "../schema/variantSchema";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { demoMiddleware } from "../middlewares/demoMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.route("/categories").get(getAllCategories);
router.route("/features").get(getFeatureProduct);
router.route("/all").get(getAllProducts);
router.route("/lists/:productId").get(getListProductWithVariant);
router
  .route("/variants/:variantId")
  .delete(authMiddleware, adminMiddleware, demoMiddleware, deleteVariant)
  .patch(
    authMiddleware,
    adminMiddleware,
    demoMiddleware,
    validateInputMiddleware(baseVariantSchema),
    updateInventory,
  );
router
  .route("/:productId/variants")
  .get(getProductVariants)
  .post(createVariants);
router
  .route("/:productId")
  .get(getProductById)
  .patch(authMiddleware, adminMiddleware, demoMiddleware, updateProductDetail);

router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, adminMiddleware, demoMiddleware, createProduct);

export default router;
