import asyncHandler from "express-async-handler";
import Organization from "../model/organization";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateSession } from "../utils/utils";
import sessionModel from "../model/session";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler";

// Sign Up Organization
const setupOrganization = asyncHandler(async (req: Request, res: Response) => {
    const { Name, Email, Mobile, Password } = req.body;

    if (!Name || !Email || !Mobile || !Password) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "All fields are required",
        });
    }

    const existing = await Organization.findOne({ Email });
    if (existing) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: "Organization already registered",
        });
    }

    const org = await Organization.create({ Name, Email, Mobile, Password });

    // if (!org || typeof org._id !== "string") {
    //     org._id = org._id.toString();
    // }
    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Organization registration successful",
        data: org,
    });
});

// Login Organization
const loginOrganization = asyncHandler(async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    const org = await Organization.findOne({ Email });
    if (!org || !(await bcrypt.compare(Password, org.Password))) {
        return responseHandler.out(req, res, {
            statusCode: 401,
            status: false,
            message: "Invalid credentials",
        });
    }

    const payload = {
        _id: String(org._id),
        name: org.Name,
        email: org.Email,
    };

    const { token } = await generateSession(payload, "organization");

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Organization logged in successfully",
        data: {
            _id: org._id,
            name: org.Name,
            email: org.Email,
            token,
        },
    });
});

// Logout Organization
const logoutOrganization = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
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

export { setupOrganization, loginOrganization, logoutOrganization };
