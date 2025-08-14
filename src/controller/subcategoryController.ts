// controllers/subcategoryController.ts
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CategorySubcategoryEnumMap } from "../utils/enum/subcategoryEnum"; // your subcategory enums
import { subcategoryModel } from "../model/subcategoryModel";
import { categoryModel } from "../model/category";
import assetModel from "../model/assets";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler";

// Create Subcategory
// Create Subcategory
const createSubcategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { CategoryId } = req.params;
    const { Name } = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can create subcategories.",
        });
    }

    // Check category
    const category = await categoryModel.findById(CategoryId);
    if (!category) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Category not found.",
        });
    }

    // Check asset for category
    const asset = await assetModel.findById(category.AssetId);
    if (!asset) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Associated asset not found.",
        });
    }

    // --- UPDATED VALIDATION LOGIC ---
    const categoryKey = category.Name.toLowerCase().replace(/\s+/g, "-");

    let allowedSubcategories: readonly string[] | undefined;

    // Loop through main categories to find the matching one
    for (const mainKey of Object.keys(CategorySubcategoryEnumMap)) {
        const subMap =
            CategorySubcategoryEnumMap[mainKey as keyof typeof CategorySubcategoryEnumMap];
        if (categoryKey in subMap) {
            allowedSubcategories = subMap[categoryKey as keyof typeof subMap];
            break;
        }
    }

    if (!allowedSubcategories) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Invalid category key: ${categoryKey}`,
        });
    }

    if (!allowedSubcategories.includes(Name)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Subcategory name '${Name}' is not valid for the category ${category.Name}.`,
        });
    }
    // --- END UPDATED VALIDATION LOGIC ---

    // Limit to 10 subcategories
    const count = await subcategoryModel.countDocuments({ CategoryId });
    if (count >= 10) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Category '${category.Name}' already has the maximum of 10 subcategories.`,
        });
    }

    // Prevent duplicates within the same category
    const duplicate = await subcategoryModel.findOne({ CategoryId, Name });
    if (duplicate) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: `Subcategory '${Name}' already exists in category '${category.Name}'.`,
        });
    }

    // Create
    const subcategory = await subcategoryModel.create({
        Name,
        CategoryId,
        AssetId: category.AssetId,
        CreatedBy: req.user!._id,
    });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Subcategory created successfully.",
        data: subcategory,
    });
});

// Get All Subcategories by CategoryId
const getSubcategoriesByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { CategoryId } = req.params;

    const subcategories = await subcategoryModel
        .find({ CategoryId })
        .select("-__v -createdAt -updatedAt")
        .populate("CreatedBy", "Name Email");

    if (!subcategories || subcategories.length === 0) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "No subcategories found for this category.",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Subcategories fetched successfully.",
        data: subcategories,
    });
});

// Update Subcategory by SubcategoryId
// Update Subcategory
const updateSubcategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { SubcategoryId } = req.params;
    const { Name } = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can update subcategories.",
        });
    }

    // Find subcategory
    const subcategory = await subcategoryModel.findById(SubcategoryId);
    if (!subcategory) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Subcategory not found.",
        });
    }

    // Get related category
    const category = await categoryModel.findById(subcategory.CategoryId);
    if (!category) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Category not found.",
        });
    }

    // --- UPDATED VALIDATION LOGIC ---
    const categoryKey = category.Name.toLowerCase().replace(/\s+/g, "-");

    let allowedSubcategories: readonly string[] | undefined;

    for (const mainKey of Object.keys(CategorySubcategoryEnumMap)) {
        const subMap = CategorySubcategoryEnumMap[mainKey as keyof typeof CategorySubcategoryEnumMap];
        if (categoryKey in subMap) {
            allowedSubcategories = subMap[categoryKey as keyof typeof subMap];
            break;
        }
    }

    if (!allowedSubcategories) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Invalid category key: ${categoryKey}`,
        });
    }

    if (!allowedSubcategories.includes(Name)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: `Subcategory name '${Name}' is not valid for the category ${category.Name}.`,
        });
    }
    // --- END UPDATED VALIDATION LOGIC ---

    // Prevent duplicates
    const duplicate = await subcategoryModel.findOne({
        CategoryId: subcategory.CategoryId,
        Name,
        _id: { $ne: SubcategoryId },
    });

    if (duplicate) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: `Subcategory '${Name}' already exists in category '${category.Name}'.`,
        });
    }

    // Update
    subcategory.Name = Name;
    await subcategory.save();

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Subcategory updated successfully.",
        data: subcategory,
    });
});

// Delete Subcategory by SubcategoryId
const deleteSubcategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { SubcategoryId } = req.params;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can delete subcategories.",
        });
    }

    const subcategory = await subcategoryModel.findById(SubcategoryId);
    if (!subcategory) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Subcategory not found.",
        });
    }

    await subcategoryModel.findByIdAndDelete(SubcategoryId);

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Subcategory deleted successfully.",
    });
});

export { createSubcategory, getSubcategoriesByCategory, updateSubcategory, deleteSubcategory };

//backup code
// // controllers/subcategoryController.ts
// import asyncHandler from "express-async-handler";
// import { Request, Response } from "express";
// import { CategorySubcategoryEnumMap } from "../utils/enum/subcategoryEnum";
// import { subcategoryModel } from "../model/subcategoryModel";
// import { categoryModel } from "../model/category";
// import assetModel from "../model/assets";
// import { AuthenticatedRequest } from "../types";
// import { responseHandler } from "../middleware/responseHandler";

// // Helper to normalize keys
// const normalizeKey = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

// // Create Subcategory
// const createSubcategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { CategoryId } = req.params;
//     const { Name } = req.body;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can create subcategories.",
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

//     const asset = await assetModel.findById(category.AssetId);
//     if (!asset) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Associated asset not found.",
//         });
//     }

//     const assetKey = normalizeKey(asset.Name);
//     const categoryKey = normalizeKey(category.Name);

//     const allowedSubcategories =
//         CategorySubcategoryEnumMap[assetKey]?.[categoryKey];

//     if (!allowedSubcategories) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: `Invalid category key: ${categoryKey}`,
//         });
//     }

//     if (!allowedSubcategories.includes(Name)) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: `Subcategory name '${Name}' is not valid for the category ${category.Name}.`,
//         });
//     }

//     const count = await subcategoryModel.countDocuments({ CategoryId });
//     if (count >= 10) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: `Category '${category.Name}' already has the maximum of 10 subcategories.`,
//         });
//     }

//     const duplicate = await subcategoryModel.findOne({ CategoryId, Name });
//     if (duplicate) {
//         return responseHandler.out(req, res, {
//             statusCode: 409,
//             status: false,
//             message: `Subcategory '${Name}' already exists in category '${category.Name}'.`,
//         });
//     }

//     const subcategory = await subcategoryModel.create({
//         Name,
//         CategoryId,
//         AssetId: category.AssetId,
//         CreatedBy: req.user!._id,
//     });

//     return responseHandler.out(req, res, {
//         statusCode: 201,
//         status: true,
//         message: "Subcategory created successfully.",
//         data: subcategory,
//     });
// });

// // Get All Subcategories by CategoryId
// const getSubcategoriesByCategory = asyncHandler(async (req: Request, res: Response) => {
//     const { CategoryId } = req.params;

//     const subcategories = await subcategoryModel
//         .find({ CategoryId })
//         .select("-__v -createdAt -updatedAt")
//         .populate("CreatedBy", "Name Email");

//     if (!subcategories.length) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "No subcategories found for this category.",
//         });
//     }

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Subcategories fetched successfully.",
//         data: subcategories,
//     });
// });

// // Update Subcategory
// const updateSubcategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { SubcategoryId } = req.params;
//     const { Name } = req.body;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can update subcategories.",
//         });
//     }

//     const subcategory = await subcategoryModel.findById(SubcategoryId);
//     if (!subcategory) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Subcategory not found.",
//         });
//     }

//     const category = await categoryModel.findById(subcategory.CategoryId);
//     if (!category) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Category not found.",
//         });
//     }

//     const asset = await assetModel.findById(category.AssetId);
//     if (!asset) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Associated asset not found.",
//         });
//     }

//     const assetKey = normalizeKey(asset.Name);
//     const categoryKey = normalizeKey(category.Name);

//     const allowedSubcategories =
//         CategorySubcategoryEnumMap[assetKey]?.[categoryKey];

//     if (!allowedSubcategories) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: `Invalid category key: ${categoryKey}`,
//         });
//     }

//     if (!allowedSubcategories.includes(Name)) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: `Subcategory name '${Name}' is not valid for the category ${category.Name}.`,
//         });
//     }

//     const duplicate = await subcategoryModel.findOne({
//         CategoryId: subcategory.CategoryId,
//         Name,
//         _id: { $ne: SubcategoryId },
//     });

//     if (duplicate) {
//         return responseHandler.out(req, res, {
//             statusCode: 409,
//             status: false,
//             message: `Subcategory '${Name}' already exists in category '${category.Name}'.`,
//         });
//     }

//     subcategory.Name = Name;
//     await subcategory.save();

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Subcategory updated successfully.",
//         data: subcategory,
//     });
// });

// // Delete Subcategory
// const deleteSubcategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { SubcategoryId } = req.params;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can delete subcategories.",
//         });
//     }

//     const subcategory = await subcategoryModel.findById(SubcategoryId);
//     if (!subcategory) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Subcategory not found.",
//         });
//     }

//     await subcategoryModel.findByIdAndDelete(SubcategoryId);

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Subcategory deleted successfully.",
//     });
// });

// export {
//     createSubcategory,
//     getSubcategoriesByCategory,
//     updateSubcategory,
//     deleteSubcategory,
// };
