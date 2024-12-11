import { Router } from "express";
import { generateImage, getProcessedImageUrlsByUserId, getImages, downloadImage } from "../controllers/image.controller.js";
import { removeBackground } from "../controllers/removeBg.controller.js";
import { processImage, uploadSelectedImage } from "../controllers/processorImg.controller.js";

const router = Router();

router.post("/generate-image", generateImage);
router.post("/process-image", processImage);
router.get("/", getImages);
router.post("/upload-variation", uploadSelectedImage);
router.get("/get-images/:userId", getProcessedImageUrlsByUserId);
router.get("/download/:fileName", downloadImage);
router.post('/remove-bg', removeBackground);

export default router;
