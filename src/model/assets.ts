import mongoose, { Schema } from "mongoose";
import { IAsset } from "../types";

const assetSchema = new Schema<IAsset>(
    {
        Name: {
            type: String,
            required: true,
            unique: true,
        },
        PricePerMonth: {
            type: Number,
            required: true,
        },
        ImageUrl: {
            type: String,
            // required: true,
        },
        Description: {
            type: String,
            default: "",
        },
        IsActive: {
            type: Boolean,
            default: true,
        },
        CreatedBy: {
            type: Schema.Types.ObjectId,
            ref: "admin",
        },
    },
    { timestamps: true }
);

const assetModel = mongoose.model<IAsset>("asset", assetSchema);
export default assetModel;
