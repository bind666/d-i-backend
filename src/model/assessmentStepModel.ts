import mongoose, { Schema } from "mongoose";
import { IAssessmentStep } from "../types";

const assessmentStepSchema = new Schema<IAssessmentStep>(
    {
        AssessmentId: {
            type: Schema.Types.ObjectId,
            ref: "assest",
            required: true,
        },
        UserId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        StepNumber: {
            type: Number,
            required: true,
        },
        AssetId: {
            type: Schema.Types.ObjectId,
            ref: "asset",
            required: true,
        },
        AssetName: {
            type: String,
            required: true,
        },
        CategoryId: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        CategoryName: {
            type: String,
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
            required: true,
        },
    },
    { timestamps: true }
);

const assessmentStepModel = mongoose.model<IAssessmentStep>("assessmentStep", assessmentStepSchema);
export default assessmentStepModel;
