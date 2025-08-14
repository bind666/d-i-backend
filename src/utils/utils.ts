// utility
import jwt from "jsonwebtoken";
import createError from "http-errors";
import config from "../config/config";
import { JwtPayload } from "../types";
import sessionModel from "../model/session";
// "test": "jest --config jest.config.ts"

// const generateSession = async (payload: JwtPayload) => {
//     if (!payload || typeof payload !== "object") {
//         throw createError(422, "Payload required.");
//     }

//     const token = jwt.sign(payload, config.JWT_SECRET!, { expiresIn: "1d" });

//     await sessionModel.create({
//         userId: payload._id,
//         token,
//         expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
//     });

//     return { token };
// };
const generateSession = async (
    payload: JwtPayload,
    userModelType: "userModel" | "organization" | "admin"
) => {
    if (!payload || typeof payload !== "object") {
        throw createError(422, "Payload required.");
    }

    const token = jwt.sign(payload, config.JWT_SECRET!, { expiresIn: "1d" });

    await sessionModel.create({
        // userId: payload._id,
        userId: String(payload._id),
        userModelType,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    return { token };
};

const verifyToken = async (token: string): Promise<JwtPayload> => {
    return jwt.verify(token, config.JWT_SECRET!) as JwtPayload;
};

const checkTokenExpiry = (time: number): boolean => {
    const expiryTime = new Date(time * 1000);
    return expiryTime <= new Date();
};

export { generateSession, verifyToken, checkTokenExpiry };
