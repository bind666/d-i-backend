import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
// import createError from "http-errors";
import adminModel from "../model/admin";
import sessionModel from "../model/session";
import { generateSession } from "../utils/utils";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler"; // adjust path if needed

// Register Admin
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { Name, Email, Password, Role } = req.body;

    if (!Name || !Email || !Password) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Name, Email, and Password are required",
        });
    }

    const existingAdmin = await adminModel.findOne({ Email });
    if (existingAdmin) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: "Admin with this email already exists",
        });
    }

    const admin = await adminModel.create({ Name, Email, Password, Role });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Admin registered successfully",
        data: {
            _id: admin._id,
            name: admin.Name,
            email: admin.Email,
            role: admin.Role,
        },
    });
});

// Login Admin
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { Email, Password } = req.body;

    const admin = await adminModel.findOne({ Email });
    if (!admin || !(await bcrypt.compare(Password, admin.Password))) {
        return responseHandler.out(req, res, {
            statusCode: 401,
            status: false,
            message: "Invalid credentials",
        });
    }

    const payload = {
        // _id: admin._id,
        _id: String(admin._id),
        name: admin.Name,
        email: admin.Email,
    };

    const { token } = await generateSession(payload, "admin");

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Admin logged in successfully",
        data: {
            _id: admin._id,
            name: admin.Name,
            email: admin.Email,
            role: admin.Role,
            token,
        },
    });
});

// Logout Admin
const logoutAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
        await sessionModel.findOneAndDelete({ token });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Admin logged out successfully",
    });
});

// Get Admin Profile
const getAdminProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Admin profile fetched successfully",
        data: req.user,
    });
});

export { registerAdmin, loginAdmin, logoutAdmin, getAdminProfile };

//assesment step
//stepID//asseesmnet id === _id/////
