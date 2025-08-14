import { Response } from "express";
import asyncHandler from "express-async-handler";
import { assessmentModel } from "../model/assesments";
import assessmentStepModel from "../model/assessmentStepModel";
import { AuthenticatedRequest } from "../types";
import assetModel from "../model/assets";
import { responseHandler } from "../middleware/responseHandler";

// Start or resume assessment
export const startOrResumeAssessment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { AssetId } = req.body;

        if (!AssetId) {
            return responseHandler.out(req, res, {
                statusCode: 400,
                status: false,
                message: "AssetId is required.",
            });
        }

        const assetExists = await assetModel.findById(AssetId);
        if (!assetExists) {
            return responseHandler.out(req, res, {
                statusCode: 404,
                status: false,
                message: "Asset not found.",
            });
        }

        let assessment = await assessmentModel.findOne({
            UserId: req.user!._id,
            AssetId,
        });

        if (!assessment) {
            assessment = await assessmentModel.create({
                UserId: req.user!._id,
                AssetId,
                Responses: [],
                Steps: 0,
                CurrentStep: 1, // new field to track user's current step
            });
        }

        return responseHandler.out(req, res, {
            statusCode: 200,
            status: true,
            message: "Assessment started/resumed successfully.",
            data: assessment,
        });
    }
);

// Save individual step answer
// export const saveStepAnswer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { AssessmentId } = req.params;
//     const { StepNumber, AssetId, AssetName, CategoryId, CategoryName, QuestionId, AnswerValue } =
//         req.body;

//     if (![1, 2, 3, 4, 5].includes(AnswerValue)) {
//         return responseHandler.out(req, res, {
//             statusCode: 400,
//             status: false,
//             message: "AnswerValue must be between 1 and 5.",
//         });
//     }

//     const assessment = await assessmentModel.findOne({
//         _id: AssessmentId,
//         UserId: req.user!._id,
//     });

//     if (!assessment) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Assessment not found.",
//         });
//     }

//     // Always update current step so user can resume later
//     assessment.CurrentStep = StepNumber;

//     await assessment.save();

//     // Save or update temp step answer
//     const existing = await assessmentStepModel.findOne({
//         AssessmentId,
//         UserId: req.user!._id,
//         StepNumber,
//         QuestionId,
//     });

//     if (existing) {
//         existing.AnswerValue = AnswerValue;
//         await existing.save();
//     } else {
//         await assessmentStepModel.create({
//             AssessmentId,
//             UserId: req.user!._id,
//             StepNumber,
//             AssetId,
//             AssetName,
//             CategoryId,
//             CategoryName,
//             QuestionId,
//             AnswerValue,
//         });
//     }

//     // Count current temp step answers in batch
//     const stepCount = await assessmentStepModel.countDocuments({
//         AssessmentId,
//         UserId: req.user!._id,
//     });

//     if (stepCount >= 10) {
//         const steps = await assessmentStepModel.find({ AssessmentId, UserId: req.user!._id });

//         for (const step of steps) {
//             const existingRes = assessment.Responses.find(
//                 (r) => r.QuestionId.toString() === step.QuestionId.toString()
//             );

//             if (existingRes) {
//                 existingRes.AnswerValue = step.AnswerValue;
//             } else {
//                 assessment.Responses.push({
//                     CategoryId: step.CategoryId,
//                     QuestionId: step.QuestionId,
//                     AnswerValue: step.AnswerValue,
//                 });
//             }
//         }

//         assessment.Steps += steps.length;

//         // Reset to first step for new batch
//         assessment.CurrentStep = 1;

//         if (assessment.Steps >= 100) {
//             assessment.Status = "completed";
//             assessment.CompletedAt = new Date();
//         }

//         await assessment.save();

//         await assessmentStepModel.deleteMany({ AssessmentId, UserId: req.user!._id });
//     }

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: `Step ${StepNumber} answer saved.`,
//         data: assessment.CurrentStep,
//     });
// });
// Save individual step answer
export const saveStepAnswer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { AssessmentId } = req.params;
    const { StepNumber, AssetId, AssetName, CategoryId, CategoryName, QuestionId, AnswerValue } =
        req.body;

    if (![1, 2, 3, 4, 5].includes(AnswerValue)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "AnswerValue must be between 1 and 5.",
        });
    }

    const assessment = await assessmentModel.findOne({
        _id: AssessmentId,
        UserId: req.user!._id,
    });
    // console.log(assessment);

    if (!assessment) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Assessment not found.",
        });
    }

    // Always update current step so user can resume later
    assessment.CurrentStep = StepNumber;
    await assessment.save();

    // Save or update temp step answer
    const existing = await assessmentStepModel.findOne({
        AssessmentId,
        UserId: req.user!._id,
        StepNumber,
        QuestionId,
    });

    if (existing) {
        existing.AnswerValue = AnswerValue;
        await existing.save();
    } else {
        await assessmentStepModel.create({
            AssessmentId,
            UserId: req.user!._id,
            StepNumber,
            AssetId,
            AssetName,
            CategoryId,
            CategoryName,
            QuestionId,
            AnswerValue,
        });
    }

    // Fetch all step answers for this assessment (before finalizing batch)
    const allStepAnswers = await assessmentStepModel.find({
        AssessmentId,
        UserId: req.user!._id,
    });

    // Count current temp step answers in batch
    const stepCount = allStepAnswers.length;

    if (stepCount >= 10) {
        const steps = [...allStepAnswers];

        // Merge into assessment.Responses
        for (const step of steps) {
            const existingRes = assessment.Responses.find(
                (r) => r.QuestionId.toString() === step.QuestionId.toString()
            );

            if (existingRes) {
                existingRes.AnswerValue = step.AnswerValue;
            } else {
                assessment.Responses.push({
                    CategoryId: step.CategoryId,
                    QuestionId: step.QuestionId,
                    AnswerValue: step.AnswerValue,
                });
            }
        }

        assessment.Steps += steps.length;

        // Reset to first step for new batch
        assessment.CurrentStep = 1;

        if (assessment.Steps >= 100) {
            assessment.Status = "completed";
            assessment.CompletedAt = new Date();
        }

        await assessment.save();

        // Clear temp step answers after batch
        await assessmentStepModel.deleteMany({ AssessmentId, UserId: req.user!._id });

        // Return full updated assessment after batch completion
        return responseHandler.out(req, res, {
            statusCode: 200,
            status: true,
            message: `Batch completed. All responses saved.`,
            data: {
                assessment,
                stepAnswers: [], // now empty since batch is done
            },
        });
    }

    // If batch not complete, return current step answers
    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: `Step ${StepNumber} answer saved.`,
        data: {
            assessment,
            stepAnswers: allStepAnswers,
        },
    });
});

// Get Assessment Steps
export const getAssessmentSteps = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { AssessmentId } = req.params;

    // Fetch the main assessment record
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

    // Fetch in-progress step answers
    const steps = await assessmentStepModel.find({
        AssessmentId,
        UserId: req.user!._id,
    });

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Assessment steps fetched successfully.",
        data: {
            assessment, // contains CurrentStep, Steps, Responses, etc.
            steps, // in-progress answers
        },
    });
});

// Get Assessment Step Count
export const getAssessmentStepCount = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { AssessmentId } = req.params;

        const count = await assessmentStepModel.countDocuments({
            AssessmentId,
            UserId: req.user!._id,
        });
        // console.log(count);

        const assessment = await assessmentModel.findOne({
            _id: AssessmentId,
            UserId: req.user!._id,
        });

        // console.log(assessment?.Steps);
        const completedSteps = assessment?.Steps;

        return responseHandler.out(req, res, {
            statusCode: 200,
            status: true,
            message: `countAssessment step count fetched successfully.`,
            data: {
                CurrentSteps: count,
                completedSteps: completedSteps,
            },
        });
    }
);
