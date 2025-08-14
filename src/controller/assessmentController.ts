import asyncHandler from "express-async-handler";
import { Response } from "express";
import { assessmentModel } from "../model/assesments";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler";

export const getAssessment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { AssessmentId } = req.params;

    const assessment = await assessmentModel.findOne({
        _id: AssessmentId,
        UserId: req.user!._id,
    });

    if (!assessment) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Assessment not found.",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Assessment fetched successfully.",
        data: assessment,
    });
});
