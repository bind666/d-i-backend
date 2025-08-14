import express from "express";
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
} from "../controller/adminController";
import { auth } from "../middleware/auth";

const adminRrouter = express.Router();

adminRrouter.post("/register", registerAdmin);
adminRrouter.post("/login", loginAdmin);
adminRrouter.delete("/logout", auth, logoutAdmin);
adminRrouter.get("/profile", auth, getAdminProfile);

export { adminRrouter };
