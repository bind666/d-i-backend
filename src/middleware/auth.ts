// // middleware/auth.ts
// import asyncHandler from "express-async-handler";
// import createError from "http-errors";
// import { checkTokenExpiry, verifyToken } from "../utils/utils";
// import userModel from "../model/user";
// import organizationModel from "../model/organization";
// import adminModel from "../model/admin"; //
// import sessionModel from "../model/session";
// import { AuthenticatedRequest } from "../types";
// import logger from "../config/logger";

// export const auth = asyncHandler(async (req: AuthenticatedRequest, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//     if (!token) return next(createError(401, "Token required."));

//     try {
//         const decoded = await verifyToken(token);

//         if (checkTokenExpiry(decoded.exp!)) {
//             return next(createError(401, "Token expired."));
//         }

//         const session = await sessionModel.findOne({ token });
//         if (!session || session.expiresAt < new Date()) {
//             return next(createError(401, "Session expired or invalid."));
//         }

//         let user;

//         switch (session.userModelType) {
//             case "userModel":
//                 user = await userModel.findById(decoded._id);
//                 break;
//             case "organization":
//                 user = await organizationModel.findById(decoded._id);
//                 break;
//             case "admin":
//                 user = await adminModel.findById(decoded._id);
//                 break;
//             default:
//                 return next(createError(401, "Invalid user model type"));
//         }

//         if (!user) return next(createError(422, "Invalid user/organization/admin."));

//         req.user = user;
//         req.modelType = session.userModelType;
//         next();
//     } catch (err) {
//         logger.error(err);
//         return next(createError(401, "Invalid token."));
//     }
// });

// middleware/auth.ts
import asyncHandler from "express-async-handler";
import { checkTokenExpiry, verifyToken } from "../utils/utils";
import userModel from "../model/user";
import organizationModel from "../model/organization";
import adminModel from "../model/admin";
import sessionModel from "../model/session";
import { AuthenticatedRequest } from "../types";
import logger from "../config/logger";
import { responseHandler } from "../middleware/responseHandler";
import { Response, NextFunction } from "express";

export const auth = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return responseHandler.out(req, res, {
                statusCode: 401,
                message: "Token required.",
                status: false,
            });
        }

        try {
            const decoded = await verifyToken(token);

            if (checkTokenExpiry(decoded.exp!)) {
                return responseHandler.out(req, res, {
                    statusCode: 401,
                    message: "Token expired.",
                    status: false,
                });
            }

            const session = await sessionModel.findOne({ token });
            if (!session || session.expiresAt < new Date()) {
                return responseHandler.out(req, res, {
                    statusCode: 401,
                    message: "Session expired or invalid.",
                    status: false,
                });
            }

            let user;

            switch (session.userModelType) {
                case "userModel":
                    user = await userModel.findById(decoded._id);
                    break;
                case "organization":
                    user = await organizationModel.findById(decoded._id);
                    break;
                case "admin":
                    user = await adminModel.findById(decoded._id);
                    break;
                default:
                    return responseHandler.out(req, res, {
                        statusCode: 401,
                        message: "Invalid user model type.",
                        status: false,
                    });
            }

            if (!user) {
                return responseHandler.out(req, res, {
                    statusCode: 422,
                    message: "Invalid user/organization/admin.",
                    status: false,
                });
            }

            req.user = user;
            req.modelType = session.userModelType;
            next();
        } catch (err) {
            // logger.error(err);
            logger.error(err as Error);
            return responseHandler.out(req, res, {
                statusCode: 401,
                message: "Invalid token.",
                status: false,
            });
        }
    }
);
