import express from "express"
import { patternWise } from "../controllers/problemController.js";

const router = express.Router();

router.get("/pattern-wise",patternWise);

export default router;