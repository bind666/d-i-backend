import { Router } from "express";
import {
    createSubcategory,
    getSubcategoriesByCategory,
    updateSubcategory,
    deleteSubcategory,
} from "../controller/subcategoryController";
import { auth } from "../middleware/auth";

const subCategoryRouter = Router();

// Create a subcategory under a category
subCategoryRouter.post("/:CategoryId", auth, createSubcategory);

// Get all subcategories for a category
subCategoryRouter.get("/:CategoryId", getSubcategoriesByCategory);

// Update a subcategory
subCategoryRouter.put("/update/:SubcategoryId", auth, updateSubcategory);

// Delete a subcategory
subCategoryRouter.delete("/delete/:SubcategoryId", auth, deleteSubcategory);

export { subCategoryRouter };
