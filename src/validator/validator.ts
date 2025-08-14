// Validator
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";

export const validateRegisterUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        Name: Joi.string().required().min(3),
        Password: Joi.string().required().min(8).max(16),
        Email: Joi.string().email().required(),
        Role: Joi.string().valid("individual", "org-member").optional(),
        QrId: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return next(createError(422, error.message));
    req.body = value;
    next();
};

export const validateLoginUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        Email: Joi.string().email().required(),
        Password: Joi.string().required().min(3).max(16),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return next(createError(422, error.message));
    req.body = value;
    next();
};

export const validateFetchRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        page: Joi.number().default(1).min(1),
        limit: Joi.number().default(10).min(1),
        sort: Joi.string().default("asc"),
        id: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.query);
    if (error) return next(createError(422, "Validation error"));
    req.query = value;
    next();
};
