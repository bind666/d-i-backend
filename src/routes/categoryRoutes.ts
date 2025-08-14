import express from "express";
import { auth } from "../middleware/auth";
import {
    createCategory,
    deleteCategory,
    getCategoriesByAsset,
    updateCategory,
} from "../controller/categoryController";

const categoryRouter = express.Router();

categoryRouter.post("/create/:AssetId", auth, createCategory);
categoryRouter.get("/asset/:AssetId", getCategoriesByAsset);
categoryRouter.put("/update/:CategoryId", auth, updateCategory);
categoryRouter.delete("/delete/:CategoryId", auth, deleteCategory);

export { categoryRouter };
