import mongoose, { Schema } from "mongoose";
import { ISession } from "../types";

const sessionSchema = new Schema<ISession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "userModelType", // Dynamic reference
        },
        userModelType: {
            type: String,
            required: true,
            enum: ["userModel", "organization", "admin"], // Valid model names
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const sessionModel = mongoose.model<ISession>("session", sessionSchema);
export default sessionModel;
