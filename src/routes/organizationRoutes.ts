// routes/organizationRoutes.ts
import express from "express";
import { auth } from "../middleware/auth";
import {
    loginOrganization,
    logoutOrganization,
    setupOrganization,
} from "../controller/organizationController";

const organizationRouter = express.Router();

organizationRouter.post("/register", setupOrganization);
organizationRouter.post("/login", loginOrganization);
organizationRouter.post("/logout", auth, logoutOrganization);

export { organizationRouter };
