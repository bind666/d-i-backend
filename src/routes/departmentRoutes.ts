import express from "express";
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartmentById,
    deleteDepartmentById,
} from "../controller/departmentController";
import { auth } from "../middleware/auth";

const departmentRouter = express.Router();

departmentRouter.post("/create", auth, createDepartment);
departmentRouter.get("/", getAllDepartments);
departmentRouter.get("/:id", getDepartmentById);
departmentRouter.put("/update/:id", auth, updateDepartmentById);
departmentRouter.delete("/delete/:id", auth, deleteDepartmentById);

export { departmentRouter };
