import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../types";
import { assessmentModel } from "../model/assesments";
import { assessmentResultModel } from "../model/assessmentResultModel";
import { responseHandler } from "../middleware/responseHandler";

export const assesmentResult = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { AssessmentId } = req.params;

    // 1. Find the assessment
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

    if (!assessment.Responses || assessment.Responses.length === 0) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "No responses found for this assessment.",
        });
    }

    // 2. Calculate scores
    const maxQuestionScore = 5; // because your stored values are (1, 2, 3, 4, 5)
    const totalQuestions = assessment.Responses.length;
    const maxScore = totalQuestions * maxQuestionScore;

    const totalScore = assessment.Responses.reduce((sum, r) => sum + (r.AnswerValue || 0), 0);
    const percentage = (totalScore / maxScore) * 100;

    // 3. Category-wise scores
    const categoryMap: Record<string, { score: number; maxScore: number }> = {};
    assessment.Responses.forEach((r) => {
        const catId = r.CategoryId.toString();
        if (!categoryMap[catId]) {
            categoryMap[catId] = { score: 0, maxScore: 0 };
        }
        categoryMap[catId].score += r.AnswerValue || 0;
        categoryMap[catId].maxScore += maxQuestionScore;
    });

    const categoryScores = Object.entries(categoryMap).map(([CategoryId, data]) => ({
        CategoryId,
        Score: data.score,
        MaxScore: data.maxScore,
        Percentage: (data.score / data.maxScore) * 100,
    }));

    // 4. Determine advice
    let adviceMessage = "";
    const recommendedCourseId = null;

    if (percentage < 30) {
        adviceMessage =
            "Your score indicates a need for significant improvement. We recommend starting with the basics.";
    } else if (percentage < 60) {
        adviceMessage =
            "You're on the right track! Consider taking our intermediate improvement program.";
    } else {
        adviceMessage = "Great job! You’re well-prepared. Consider advanced-level materials.";
    }

    // 5. Save to result model
    const result = await assessmentResultModel.create({
        AssessmentId: assessment._id,
        UserId: assessment.UserId,
        AssetId: assessment.AssetId,
        TotalScore: totalScore,
        MaxScore: maxScore,
        Percentage: percentage,
        AdviceMessage: adviceMessage,
        RecommendedCourseId: recommendedCourseId,
        CategoryScores: categoryScores,
        CompletedAt: new Date(),
    });

    // 6. Mark assessment as completed
    assessment.Status = "completed";
    await assessment.save();

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Assessment finalized successfully.",
        data: result,
    });
});
