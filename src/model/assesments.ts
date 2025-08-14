import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../types";

const assessmentSchema = new Schema<IAssessment>(
    {
        UserId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        AssetId: {
            type: Schema.Types.ObjectId,
            ref: "asset",
            required: true,
        },
        Status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress",
        },
        StartedAt: {
            type: Date,
            default: Date.now,
        },
        CompletedAt: {
            type: Date,
        },
        Steps: {
            type: Number,
            default: 0, // Count of answered questions
        },
        CurrentStep: {
            type: Number,
            default: 1, // Start at step 1
        },

        Responses: [
            {
                CategoryId: {
                    type: Schema.Types.ObjectId,
                    ref: "category",
                    required: true,
                },
                QuestionId: {
                    type: Schema.Types.ObjectId,
                    ref: "question",
                    required: true,
                },
                AnswerValue: {
                    type: Number,
                    enum: [1, 2, 3, 4, 5],
                    required: false, // Allow undefined until user answers
                },
            },
        ],
    },
    { timestamps: true }
);

export const assessmentModel = mongoose.model<IAssessment>("assessment", assessmentSchema);

//assesment steps userid steps question no
// submit answer (array)
