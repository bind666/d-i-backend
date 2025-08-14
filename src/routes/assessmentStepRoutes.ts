import { Router } from "express";
import {
    startOrResumeAssessment,
    saveStepAnswer,
    getAssessmentSteps,
    getAssessmentStepCount,
} from "../controller/assessmentStepController";
import { auth } from "../middleware/auth";

const assesmentStepsRouter = Router();

assesmentStepsRouter.post("/start", auth, startOrResumeAssessment);
assesmentStepsRouter.post("/step/:AssessmentId", auth, saveStepAnswer);

assesmentStepsRouter.get("/steps/:AssessmentId", auth, getAssessmentSteps);
assesmentStepsRouter.get("/step-count/:AssessmentId", auth, getAssessmentStepCount);
// assesmentRouter.post("/:AssessmentId/finalize", auth, finalizeAssessmentSteps);

export { assesmentStepsRouter };
