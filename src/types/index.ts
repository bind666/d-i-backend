// types/index.ts
import { Request } from "express";
import { Document, Types } from "mongoose";
import { UserRoleEnum } from "../utils/enum/userEnum";

export interface IUser extends Document {
    _id: string;
    Name: string;
    Email: string;
    Password: string;
    // Role: "individual" | "org-member";
    Role: UserRoleEnum;
    OrgId?: Types.ObjectId | null;
    IsQrUser?: boolean;
    QrId?: string | null;
}

export interface ISession extends Document {
    userId: Types.ObjectId;
    userModelType: "userModel" | "organization" | "admin";
    token: string;
    expiresAt: Date;
}

export interface IOrganization extends Document {
    Name: string;
    Email: string;
    Mobile: string;
    Password: string;
    InvitedUsers: Types.ObjectId[];
}

// export interface AuthenticatedRequest extends Request {
//     user?: IUser;
// }
export interface AuthenticatedRequest extends Request {
    user?: IUser | IOrganization | IAdmin;
    modelType?: "userModel" | "organization" | "admin";
}

export interface JwtPayload {
    _id: string;
    name: string;
    email: string;
    exp?: number;
}

export interface IDepartment extends Document {
    Name: string;
    Description?: string;
    IsActive?: boolean;
}

export interface IAdmin extends Document {
    Name: string;
    Email: string;
    Password: string;
    Role: "admin" | "superadmin";
}

export interface IAsset extends Document {
    Name: string;
    PricePerMonth: number;
    ImageUrl: string;
    Description?: string;
    IsActive?: boolean;
    CreatedBy?: Types.ObjectId;
}

export interface IAssessment extends Document {
    UserId: Types.ObjectId;
    AssetId: Types.ObjectId;
    Status: "in-progress" | "completed";
    StartedAt: Date;
    CompletedAt?: Date;
    Steps: number;
    CurrentStep: number;
    Responses: {
        CategoryId: Types.ObjectId;
        QuestionId: Types.ObjectId;
        AnswerValue: number;
    }[];
}

export interface ICategory {
    Name: string; // Replaces Title
    AssetId: Types.ObjectId;
    CreatedBy: Types.ObjectId;
    IsActive?: boolean;
}

// export interface IQuestion extends Document {
//     Question: string;
//     CategoryId: Types.ObjectId;
//     Options: number[];
//     CreatedBy: Types.ObjectId;
//     // IsActive: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
// }
export interface IQuestion extends Document {
    Question: string;
    CategoryId: Types.ObjectId;
    SubcategoryId?: Types.ObjectId; // ✅ optional
    Options: number[];
    CreatedBy: Types.ObjectId;
    // IsActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAnswer extends Document {
    UserId: Types.ObjectId;
    AssetId: Types.ObjectId;
    CategoryId: Types.ObjectId;
    QuestionId: Types.ObjectId;
    AnswerValue: number;
    StartTime: Date;
    EndTime: Date;
}

export interface IAdminAnswer extends Document {
    AdminId: Types.ObjectId;
    AssetId: Types.ObjectId;
    CategoryId: Types.ObjectId;
    QuestionId: Types.ObjectId;
    AnswerValue: number;
}

export interface IAssessmentStep extends Document {
    AssessmentId: Types.ObjectId;
    UserId: Types.ObjectId;
    StepNumber: number; // 1 to 10
    AssetId: Types.ObjectId;
    AssetName: string;
    CategoryId: Types.ObjectId;
    CategoryName: string;
    QuestionId: Types.ObjectId;
    AnswerValue: number; // 1-5 (maps to 20, 40, 60, 80, 100 in UI)
}
// export interface IAssessmentStep extends Document {
//     AssessmentId: Types.ObjectId;
//     UserId: Types.ObjectId;
//     StepNumber: number;
//     AssetId: Types.ObjectId;
//     AssetName: string;
//     CategoryId: Types.ObjectId;
//     CategoryName: string;
//     QuestionId: Types.ObjectId;
//     AnswerValue: number; // 1–5
//     Steps: number; // Current highest step
// }

export interface IAssessmentResult extends Document {
    AssessmentId: Types.ObjectId;
    UserId: Types.ObjectId;
    AssetId: Types.ObjectId; // Which app/asset the assessment belongs to
    TotalScore: number; // Sum of all answered question values
    MaxScore: number; // Max possible score (e.g., 100 questions × 100)
    Percentage: number; // (TotalScore / MaxScore) × 100
    AdviceMessage?: string; // Suggested advice based on score
    RecommendedCourseId?: Types.ObjectId; // Optional: reference to a course
    CategoryScores: {
        CategoryId: Types.ObjectId;
        Score: number;
        MaxScore: number;
        Percentage: number;
    }[];
    CompletedAt: Date;
}

// types/index.ts
export interface ISubcategory {
    Name: string;
    CategoryId: Types.ObjectId;
    AssetId: Types.ObjectId;
    CreatedBy: Types.ObjectId;
    IsActive?: boolean;
}
