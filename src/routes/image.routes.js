import { Router } from "express";
import { generateImage, getImages } from "../controllers/image.controller.js";
import { processImage, uploadSelectedImage } from "../controllers/processorImg.controller.js";

const router = Router();

router.post("/generate-image", generateImage);
router.get("/", getImages);
router.post("/process-image", processImage);
router.post("/upload-variation", uploadSelectedImage);

export default router;
