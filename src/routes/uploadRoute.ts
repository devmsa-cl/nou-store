import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import multer from "multer";
import { extractImageType, generateRandomString } from "../utils/helper";
import { uploadS3File } from "../libs/aws";
import BadRequest from "../errors/badRequest";
import Product from "../models/Product";
import Variant from "../models/Variant";
import { MAX_UPLOAD_SIZE } from "../config/constant";
import { fi } from "zod/locales";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { demoMiddleware } from "../middlewares/demoMiddleware";

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const uploadSingle = upload.single("file");
  uploadSingle(req, res, (err) => {
    if (err) {
      // Handle multer errors
      return res.status(400).json({ error: err.message });
    }
    // validate the file
    const file = req.file;
    if (file) {
      if (file.size > MAX_UPLOAD_SIZE * 1000 * 1000) {
        //1000000
        return res
          .status(400)
          .json({ error: "File size should be less than 1MB" });
      }
    }

    next();
  });
};
const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    adminMiddleware,
    demoMiddleware,
    uploadMiddleware,
    async (req, res) => {
      const imgType = extractImageType(req.file?.mimetype as string);
      const saveFilename = generateRandomString(16) + "." + imgType;
      const path = "/uploads";
      const filepath = path + "/" + saveFilename;
      const productId = req.query.productId;
      const variantId = req.query.variantId;

      if (!productId && !variantId) {
        throw new BadRequest("ProductId or VariantId should be provided");
      }

      if (productId && variantId) {
        throw new BadRequest("ProductId or VariantId should not be provided");
      }

      // upload to s3
      await uploadS3File(path, saveFilename, req.file?.buffer as Buffer);

      if (productId) {
        await Product.findByIdAndUpdate(productId, {
          $push: { images: filepath },
        });
      } else {
        await Variant.findByIdAndUpdate(variantId, {
          $push: { images: filepath },
        });
      }

      res.status(200).json({ url: filepath });
    },
  );

export default router;
