// routes/assessmentResultRoutes.ts
import { Router } from "express";
import { auth } from "../middleware/auth";
import { assesmentResult } from "../controller/assessmentResultController";

const assessmentResultRouter = Router();

// Finalize an assessment and store the result
assessmentResultRouter.post("/result/:AssessmentId", auth, assesmentResult);

export { assessmentResultRouter };
