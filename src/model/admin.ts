import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { IAdmin } from "../types";
import { AdminRoleEnum } from "../utils/enum/adminEnum";

const adminSchema = new Schema<IAdmin>(
    {
        Name: {
            type: String,
            required: true,
            set: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        },
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        Password: {
            type: String,
            required: true,
        },
        Role: {
            type: String,
            enum: Object.values(AdminRoleEnum),
            default: AdminRoleEnum.ADMIN,
        },
    },
    { timestamps: true }
);

// Hash password before save
adminSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next(); // Capital "P" since your field is `Password`

    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error: any) {
        next(createError(500, error.message));
    }
});

const adminModel = mongoose.model<IAdmin>("admin", adminSchema);
export default adminModel;
