import { Router } from "express";
import { generateImage, getImages } from "../controllers/image.controller.js";

const router = Router();

router.post("/generate-image", generateImage);
router.get("/", getImages);
router.get('/images', /* tu controlador aquí */);

export default router;