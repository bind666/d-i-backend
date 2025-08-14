// models/category.ts
import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const categorySchema = new Schema<ICategory>(
    {
        Name: {
            type: String,
            required: true,
            unique: true,
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

export const categoryModel = mongoose.model<ICategory>("category", categorySchema);
