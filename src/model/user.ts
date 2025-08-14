// User Model
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { IUser } from "../types";
import { UserRoleEnum } from "../utils/enum/userEnum";

const userSchema = new Schema<IUser>(
    {
        Name: {
            type: String,
            required: true,
            set: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        },
        Password: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            unique: true,
            required: true,
        },
        Role: {
            type: String,
            enum: Object.values(UserRoleEnum),
            default: UserRoleEnum.INDIVIDUAL,
        },
        OrgId: {
            type: Schema.Types.ObjectId,
            ref: "organizationModel",
            default: null,
        },
        IsQrUser: {
            type: Boolean,
            default: false,
        },
        QrId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("Password")) return next();
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error: any) {
        next(createError(500, error.message));
    }
});

const userModel = mongoose.model<IUser>("user", userSchema);
export default userModel;
