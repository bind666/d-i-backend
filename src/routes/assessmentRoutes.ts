import express from "express";
import { auth } from "../middleware/auth";
import { getAssessment } from "../controller/assessmentController";

const assesmentRouter = express.Router();

assesmentRouter.get("/:AssessmentId", auth, getAssessment);

export { assesmentRouter };
