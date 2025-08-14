// import express from "express";
// import {
//     createQuestion,
//     getQuestionsByCategory,
//     updateQuestion,
//     deleteQuestion,
// } from "../controller/questionController";
// import { auth } from "../middleware/auth";

// const questionRouter = express.Router();

// questionRouter.post("/create/:CategoryId", auth, createQuestion);
// questionRouter.get("/:CategoryId", getQuestionsByCategory);
// questionRouter.put("/update/:QuestionId", auth, updateQuestion);
// questionRouter.delete("/delete/:QuestionId", auth, deleteQuestion);

// export { questionRouter };

import express from "express";
import {
    createQuestion,
    getQuestionsByCategory,
    updateQuestion,
    deleteQuestion,
} from "../controller/questionController";
import { auth } from "../middleware/auth";

const questionRouter = express.Router();

questionRouter.post("/create/:CategoryId", auth, createQuestion);
questionRouter.post("/create/subcategory/:CategoryId/:SubcategoryId", auth, createQuestion);

questionRouter.get("/:CategoryId", getQuestionsByCategory);
questionRouter.get("/subcategory/:CategoryId/:SubcategoryId", getQuestionsByCategory);

questionRouter.put("/update/:QuestionId", auth, updateQuestion);

questionRouter.delete("/delete/:QuestionId", auth, deleteQuestion);

export { questionRouter };
