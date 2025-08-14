// controllers/
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { responseHandler } from "../middleware/responseHandler";
import { questionModel } from "../model/question";
import { categoryModel } from "../model/category";
import { subcategoryModel } from "../model/subcategoryModel";

// Create Question
const createQuestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { CategoryId } = req.params;
    const { SubcategoryId } = req.params;
    const { Question, Options } = req.body;
// console.log(CategoryId);

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can create questions.",
        });
    }

    // Validate category
    const category = await categoryModel.findById(CategoryId);
    // console.log(category);
    
    if (!category) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Category not found.",
        });
    }

    // Validate subcategory if provided
    if (SubcategoryId) {
        const subcategory = await subcategoryModel.findById(SubcategoryId);
        if (!subcategory || subcategory.CategoryId.toString() !== CategoryId.toString()) {
            return responseHandler.out(req, res, {
                statusCode: 400,
                status: false,
                message: "Invalid subcategory for the given category.",
            });
        }
    }

    const newQuestion = await questionModel.create({
        Question,
        CategoryId,
        SubcategoryId: SubcategoryId || null,
        Options: Options || [1, 2, 3, 4, 5],
        CreatedBy: req.user!._id,
    });

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Question created successfully.",
        data: newQuestion,
    });
});

// Get Questions by Category/Subcategory
const getQuestionsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { CategoryId } = req.params;
    const { subcategoryId } = req.query;

    const filter: any = { CategoryId };
    if (subcategoryId) filter.SubcategoryId = subcategoryId;

    const questions = await questionModel
        .find(filter)
        .select("-__v -createdAt -updatedAt")
        .populate("CreatedBy", "Name Email")
        .populate("SubcategoryId", "Name");

    if (!questions.length) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "No questions found.",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Questions fetched successfully.",
        data: questions,
    });
});

// Update Question
const updateQuestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { QuestionId } = req.params;
    const { Question, Options, CategoryId, SubcategoryId } = req.body;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can update questions.",
        });
    }

    const question = await questionModel.findById(QuestionId);
    if (!question) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Question not found.",
        });
    }

    if (CategoryId) {
        const category = await categoryModel.findById(CategoryId);
        if (!category) {
            return responseHandler.out(req, res, {
                statusCode: 404,
                status: false,
                message: "Category not found.",
            });
        }
        question.CategoryId = CategoryId;
    }

    if (SubcategoryId) {
        const subcategory = await subcategoryModel.findById(SubcategoryId);
        if (!subcategory || subcategory.CategoryId.toString() !== (CategoryId || question.CategoryId).toString()) {
            return responseHandler.out(req, res, {
                statusCode: 400,
                status: false,
                message: "Invalid subcategory for the given category.",
            });
        }
        question.SubcategoryId = SubcategoryId;
    }

    if (Question) question.Question = Question;
    if (Options) question.Options = Options;

    await question.save();

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Question updated successfully.",
        data: question,
    });
});

// Delete Question
const deleteQuestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { QuestionId } = req.params;

    if (req.modelType !== "admin") {
        return responseHandler.out(req, res, {
            statusCode: 403,
            status: false,
            message: "Only admins can delete questions.",
        });
    }

    const question = await questionModel.findById(QuestionId);
    if (!question) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Question not found.",
        });
    }

    await questionModel.findByIdAndDelete(QuestionId);

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Question deleted successfully.",
    });
});

export { createQuestion, getQuestionsByCategory, updateQuestion, deleteQuestion };

//backup code
// import asyncHandler from "express-async-handler";
// import { Request, Response } from "express";
// import { AuthenticatedRequest } from "../types";
// import { responseHandler } from "../middleware/responseHandler";
// import { questionModel } from "../model/question";
// import { categoryModel } from "../model/category";

// // Create Question
// const createQuestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { CategoryId } = req.params;
//     const { Question, Options } = req.body;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can create questions.",
//         });
//     }

//     const category = await categoryModel.findById(CategoryId);
//     if (!category) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Category not found.",
//         });
//     }

//     const newQuestion = await questionModel.create({
//         Question,
//         CategoryId,
//         Options: Options || [1, 2, 3, 4, 5],
//         CreatedBy: req.user!._id,
//     });

//     return responseHandler.out(req, res, {
//         statusCode: 201,
//         status: true,
//         message: "Question created successfully.",
//         data: newQuestion,
//     });
// });

// // Get Questions by Category
// const getQuestionsByCategory = asyncHandler(async (req: Request, res: Response) => {
//     const { CategoryId } = req.params;

//     const questions = await questionModel
//         .find({ CategoryId })
//         .select("-__v -createdAt -updatedAt")
//         .populate("CreatedBy", "Name Email");
//     // .populate("AssetId")

//     if (!questions || questions.length === 0) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "No questions found for this category.",
//         });
//     }

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Questions fetched successfully.",
//         data: questions,
//     });
// });

// // Update Question
// const updateQuestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { QuestionId } = req.params;
//     const { Question, Options } = req.body;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can update questions.",
//         });
//     }

//     const question = await questionModel.findById(QuestionId);
//     if (!question) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Question not found.",
//         });
//     }

//     if (Question) question.Question = Question;
//     if (Options) question.Options = Options;

//     await question.save();

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Question updated successfully.",
//         data: question,
//     });
// });

// // Delete Question
// const deleteQuestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//     const { QuestionId } = req.params;

//     if (req.modelType !== "admin") {
//         return responseHandler.out(req, res, {
//             statusCode: 403,
//             status: false,
//             message: "Only admins can delete questions.",
//         });
//     }

//     const question = await questionModel.findById(QuestionId);
//     if (!question) {
//         return responseHandler.out(req, res, {
//             statusCode: 404,
//             status: false,
//             message: "Question not found.",
//         });
//     }

//     await questionModel.findByIdAndDelete(QuestionId);

//     return responseHandler.out(req, res, {
//         statusCode: 200,
//         status: true,
//         message: "Question deleted successfully.",
//     });
// });

// export { createQuestion, getQuestionsByCategory, updateQuestion, deleteQuestion };
