import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import assetModel from "../model/assets";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler";

// Create Asset
const createAsset = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { Name, PricePerMonth, Description, ImageUrl } = req.body;

    if (!Name || !PricePerMonth) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Name and PricePerMonth are required",
        });
    }

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can create assets",
        });
    }

    const existingAsset = await assetModel.findOne({ Name });
    if (existingAsset) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: "Asset with this name already exists",
        });
    }

    const asset = await assetModel.create({
        Name,
        PricePerMonth,
        Description,
        ImageUrl,
        CreatedBy: req.user?._id,
    });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Asset created successfully",
        data: asset,
    });
});

// Update Asset
const updateAsset = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can update assets",
        });
    }

    const asset = await assetModel.findById(id);
    if (!asset) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Asset not found",
        });
    }

    Object.assign(asset, updates);
    await asset.save();

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Asset updated successfully",
        data: asset,
    });
});

// Delete Asset
const deleteAsset = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can delete assets",
        });
    }

    const asset = await assetModel.findByIdAndDelete(id);
    if (!asset) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Asset not found",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Asset deleted successfully",
    });
});

// Get All Active Assets
const getAllAssets = asyncHandler(async (req: Request, res: Response) => {
    const assets = await assetModel.find({ IsActive: true });

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Assets fetched successfully",
        data: assets,
    });
});

// Get Asset By ID
const getAssetById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const asset = await assetModel.findById(id);
    if (!asset) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Asset not found",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Asset fetched successfully",
        data: asset,
    });
});

export { createAsset, updateAsset, deleteAsset, getAllAssets, getAssetById };
