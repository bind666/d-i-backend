import mongoose, { Schema } from "mongoose";
import { IAssessmentResult } from "../types";

const assessmentResultSchema = new Schema<IAssessmentResult>(
    {
        AssessmentId: {
            type: Schema.Types.ObjectId,
            ref: "Assessment",
            required: true,
        },
        UserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        AssetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset",
            required: true,
        },
        TotalScore: {
            type: Number,
            required: true,
        },
        MaxScore: {
            type: Number,
            required: true,
        },
        Percentage: {
            type: Number,
            required: true,
        },
        AdviceMessage: {
            type: String,
        },
        RecommendedCourseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
        CategoryScores: [
            {
                CategoryId: {
                    type: Schema.Types.ObjectId,
                    ref: "Category",
                    required: true,
                },
                Score: {
                    type: Number,
                    required: true,
                },
                MaxScore: {
                    type: Number,
                    required: true,
                },
                Percentage: {
                    type: Number,
                    required: true,
                },
            },
        ],
        CompletedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const assessmentResultModel = mongoose.model<IAssessmentResult>(
    "AssessmentResult",
    assessmentResultSchema
);
