import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { IOrganization } from "../types";

const organizationSchema = new Schema<IOrganization>(
    {
        Name: {
            type: String,
            required: true,
            set: (val: string) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
        },
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        Mobile: {
            type: String,
            required: true,
            trim: true,
        },
        Password: {
            type: String,
            required: true,
        },
        InvitedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "userModel",
                default: null,
            },
        ],
    },
    { timestamps: true }
);

// Hash password before saving
organizationSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("Password")) return next();
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error: any) {
        next(createError(500, error.message));
    }
});

const organizationModel = mongoose.model<IOrganization>("organization", organizationSchema);
export default organizationModel;
