import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import userModel from "../model/user";
import { generateSession } from "../utils/utils";
import sessionModel from "../model/session";
import { AuthenticatedRequest } from "../types";
import { UserRoleEnum } from "../utils/enum/userEnum";
import { responseHandler } from "../middleware/responseHandler";

// SignUp Individual User and Invited User
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { Name, Email, Password, Role, QrId } = req.body;

    if (!Name || !Email || !Password) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Name, Email, and Password are required.",
        });
    }

    if (Role && !Object.values(UserRoleEnum).includes(Role)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Invalid role provided.",
        });
    }

    const existingUser = await userModel.findOne({ Email });
    if (existingUser) {
        return responseHandler.out(req, res, {
            statusCode: 422,
            status: false,
            message: "User already exists",
        });
    }

    const user = await userModel.create({
        Name,
        Email,
        Password,
        Role: Role ?? UserRoleEnum.INDIVIDUAL,
        IsQrUser: false,
        QrId: QrId || null,
    });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "User registered successfully",
        data: user,
    });
});

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    const user = await userModel.findOne({ Email });

    if (!user || !(await bcrypt.compare(Password, user.Password))) {
        return responseHandler.out(req, res, {
            statusCode: 401,
            status: false,
            message: "Invalid credentials",
        });
    }

    const payload = {
        _id: user._id,
        name: user.Name,
        email: user.Email,
    };

    const { token } = await generateSession(payload, "userModel");

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "User logged in successfully",
        data: {
            _id: user._id,
            name: user.Name,
            email: user.Email,
            token,
        },
    });
});

// Logout User
const logoutUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
        await sessionModel.findOneAndDelete({ token });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Logout successfully",
    });
});

// Get Profile
const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "User profile fetched successfully",
        data: req.user,
    });
});

export { registerUser, loginUser, logoutUser, getProfile };
