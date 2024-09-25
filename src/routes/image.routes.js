import { Router } from "express";
import { generateImage, getImages } from "../controllers/image.controller.js";
import { processImage } from "../controllers/processor.controller.js";

const router = Router();

router.post("/generate-image", generateImage);
router.get("/", getImages);
router.post("/process-image", processImage);

export default router;