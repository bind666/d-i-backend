import mongoose, { Schema } from "mongoose";
import { IDepartment } from "../types";

const departmentSchema = new Schema<IDepartment>(
    {
        Name: {
            type: String,
            required: true,
            trim: true,
        },
        Description: {
            type: String,
            default: "",
        },
        IsActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const departmentModel = mongoose.model<IDepartment>("department", departmentSchema);
export default departmentModel;
