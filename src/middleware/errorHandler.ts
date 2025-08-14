import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { ValidationError } from "joi";
import { isHttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    // Handle http-errors
    if (isHttpError(err)) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle Joi validation errors
    else if (err instanceof ValidationError) {
        statusCode = 422;
        message = err.message;
    }

    // Handle Mongoose validation errors
    else if (err instanceof MongooseError.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    // Handle Mongoose duplicate key error (e.g., duplicate email)
    else if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};
