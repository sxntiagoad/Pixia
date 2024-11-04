import { Router } from "express";
import { generateImage, getProcessedImageUrlsByUserId, getImages } from "../controllers/image.controller.js";
import { processImage, uploadSelectedImage } from "../controllers/processorImg.controller.js";

const router = Router();

router.post("/generate-image", generateImage);
router.post("/process-image", processImage);
router.get("/", getImages);
router.post("/upload-variation", uploadSelectedImage);
router.post("/get-images", getProcessedImageUrlsByUserId);

export default router;
