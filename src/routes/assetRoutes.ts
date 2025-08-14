import express from "express";
import {
    createAsset,
    deleteAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
} from "../controller/assetController";
import { auth } from "../middleware/auth";

const assetsRouter = express.Router();

// Admin-only operations
assetsRouter.post("/create", auth, createAsset);
assetsRouter.put("/update/:id", auth, updateAsset);
assetsRouter.delete("/delete/:id", auth, deleteAsset);

// Public read operations
assetsRouter.get("/", getAllAssets);
assetsRouter.get("/:id", getAssetById);

export { assetsRouter };
