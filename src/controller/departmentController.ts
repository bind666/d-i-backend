import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
// import createError from "http-errors";
import departmentModel from "../model/departments";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler"; // adjust path if needed

// Create Department - Admin Only
export const createDepartment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { Name, Description } = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 401,
            status: false,
            message: "Only admins can create departments",
        });
    }

    if (!Name) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Department name is required",
        });
    }

    const existing = await departmentModel.findOne({ Name });
    if (existing) {
        return responseHandler.out(req, res, {
            statusCode: 409,
            status: false,
            message: "Department with this name already exists",
        });
    }

    const department = await departmentModel.create({ Name, Description });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Department created successfully",
        data: department,
    });
});

// Get All Departments
export const getAllDepartments = asyncHandler(async (_req: Request, res: Response) => {
    const departments = await departmentModel.find().sort({ createdAt: -1 });

    return responseHandler.out(_req, res, {
        statusCode: 200,
        status: true,
        data: departments,
    });
});

// Get Department by ID
export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const department = await departmentModel.findById(id);
    if (!department) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Department not found",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        data: department,
    });
});

// Update Department - Admin Only
export const updateDepartmentById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { Name, Description, IsActive } = req.body;

        if (req.modelType !== "admin") {
            return responseHandler.out(req, res, {
                statusCode: 401,
                status: false,
                message: "Only admins can update departments",
            });
        }

        const department = await departmentModel.findById(id);
        if (!department) {
            return responseHandler.out(req, res, {
                statusCode: 404,
                status: false,
                message: "Department not found",
            });
        }

        if (Name) department.Name = Name;
        if (Description !== undefined) department.Description = Description;
        if (IsActive !== undefined) department.IsActive = IsActive;

        const updated = await department.save();

        return responseHandler.out(req, res, {
            statusCode: 200,
            status: true,
            message: "Department updated successfully",
            data: updated,
        });
    }
);

// Delete Department - Admin Only
export const deleteDepartmentById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;

        if (req.modelType !== "admin") {
            return responseHandler.out(req, res, {
                statusCode: 401,
                status: false,
                message: "Only admins can delete departments",
            });
        }

        const deleted = await departmentModel.findByIdAndDelete(id);
        if (!deleted) {
            return responseHandler.out(req, res, {
                statusCode: 404,
                status: false,
                message: "Department not found",
            });
        }

        return responseHandler.out(req, res, {
            statusCode: 200,
            status: true,
            message: "Department deleted successfully",
        });
    }
);
