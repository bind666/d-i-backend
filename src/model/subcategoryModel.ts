// models/subcategory.ts
import mongoose, { Schema } from "mongoose";
import { ISubcategory } from "../types";

const subcategorySchema = new Schema<ISubcategory>(
    {
        Name: {
            type: String,
            required: true,
        },
        CategoryId: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        AssetId: {
            type: Schema.Types.ObjectId,
            ref: "asset",
            required: true,
        },
        CreatedBy: {
            type: Schema.Types.ObjectId,
            ref: "admin",
            required: true,
        },
        IsActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate subcategory names within the same category
subcategorySchema.index({ CategoryId: 1, Name: 1 }, { unique: true });

export const subcategoryModel = mongoose.model<ISubcategory>("subcategory", subcategorySchema);
