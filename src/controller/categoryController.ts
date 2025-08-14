import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AppCategoryEnumMap } from "../utils/enum/categoryEnums";
import assetModel from "../model/assets";
import { categoryModel } from "../model/category";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler";

// Create Category
const createCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { AssetId } = req.params;
    const { Name } = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can create categories.",
        });
    }

    const asset = await assetModel.findById(AssetId);
    if (!asset) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Asset not found.",
        });
    }

    const appKey = asset.Name.toLowerCase().replace(/\s+/g, "");

    if (!(appKey in AppCategoryEnumMap)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Invalid app key: ${appKey}`,
        });
    }

    const allowedCategories = AppCategoryEnumMap[
        appKey as keyof typeof AppCategoryEnumMap
    ] as readonly string[];

    if (!allowedCategories.includes(Name as string)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Category name '${Name}' is not valid for the ${asset.Name} app.`,
        });
    }

    // const appKey = asset.Name.toLowerCase().replace(/\s+/g, "");
    // const allowedCategories = AppCategoryEnumMap[appKey as keyof typeof AppCategoryEnumMap];

    // if (!allowedCategories?.includes(Name)) {
    //     return responseHandler.out(req, res, {
    //         statusCode: 400,
    //         status: false,
    //         message: `Category name '${Name}' is not valid for the ${asset.Name} app.`,
    //     });
    // }

    // Check for duplicate category name within this asset
    const existingCategory = await categoryModel.findOne({ AssetId, Name });

    if (existingCategory) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: `Category with the name '${Name}' already exists under this asset.`,
        });
    }

    const category = await categoryModel.create({
        Name,
        AssetId,
        CreatedBy: req.user!._id,
    });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Category created successfully.",
        data: category,
    });
});

// Get All Categories by AssetId
const getCategoriesByAsset = asyncHandler(async (req: Request, res: Response) => {
    const { AssetId } = req.params;

    const categories = await categoryModel
        .find({ AssetId })
        .select("-__v -createdAt -updatedAt")
        .populate("CreatedBy", "Name Email");

    if (!categories || categories.length === 0) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "No categories found for this asset.",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Categories fetched successfully.",
        data: categories,
    });
});

// Update Category by CategoryId
const updateCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { CategoryId } = req.params;
    const { Name } = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can update categories.",
        });
    }

    const category = await categoryModel.findById(CategoryId);
    if (!category) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Category not found.",
        });
    }

    const asset = await assetModel.findById(category.AssetId);
    if (!asset) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Associated asset not found.",
        });
    }

    // const appKey = asset.Name.toLowerCase().replace(/\s+/g, "");
    // const allowedCategories = AppCategoryEnumMap[appKey as keyof typeof AppCategoryEnumMap];

    // if (!allowedCategories?.includes(Name)) {
    //     return responseHandler.out(req, res, {
    //         statusCode: 400,
    //         status: false,
    //         message: `Category name '${Name}' is not valid for the ${asset.Name} app.`,
    //     });
    // }
    const appKey = asset.Name.toLowerCase().replace(/\s+/g, "");

    if (!(appKey in AppCategoryEnumMap)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Invalid app key: ${appKey}`,
        });
    }

    const allowedCategories = AppCategoryEnumMap[
        appKey as keyof typeof AppCategoryEnumMap
    ] as readonly string[];

    if (!allowedCategories.includes(Name as string)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Category name '${Name}' is not valid for the ${asset.Name} app.`,
        });
    }

    const duplicate = await categoryModel.findOne({
        _id: { $ne: CategoryId },
        AssetId: asset._id,
        Name,
    });

    if (duplicate) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: `Category name '${Name}' already exists under this asset.`,
        });
    }

    category.Name = Name;
    await category.save();

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Category updated successfully.",
        data: category,
    });
});

// Delete Category by Category Id
const deleteCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { CategoryId } = req.params;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can delete categories.",
        });
    }

    const category = await categoryModel.findById(CategoryId);
    if (!category) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Category not found.",
        });
    }

    await categoryModel.findByIdAndDelete(CategoryId);

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Category deleted successfully.",
    });
});

// const deleteCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { CategoryId } = req.params;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can delete categories.",
//         });
//     }

//     const category = await categoryModel.findById(CategoryId);
//     if (!category) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Category not found.",
//         });
//     }

//     if (!category.IsActive) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: "Category is already inactive.",
//         });
//     }

//     category.IsActive = false;
//     await category.save();

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Category deleted (deactivated) successfully.",
//     });
// });

export { createCategory, getCategoriesByAsset, updateCategory, deleteCategory };
