// import mongoose, { Schema } from "mongoose";
// import { IQuestion } from "../types";

// const questionSchema = new Schema<IQuestion>(
//     {
//         Question: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         CategoryId: {
//             type: Schema.Types.ObjectId,
//             ref: "category",
//             required: true,
//         },
//         Options: {
//             type: [Number],
//             default: [1, 2, 3, 4, 5],
//         },
//         CreatedBy: {
//             type: Schema.Types.ObjectId,
//             ref: "admin",
//             required: true,
//         },
//         // IsActive: {
//         //     type: Boolean,
//         //     default: true,
//         // },
//     },
//     { timestamps: true }
// );

// export const questionModel = mongoose.model<IQuestion>("question", questionSchema);

import mongoose, { Schema } from "mongoose";
import { IQuestion } from "../types";

const questionSchema = new Schema<IQuestion>(
    {
        Question: {
            type: String,
            required: true,
        },
        CategoryId: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        SubcategoryId: {
            type: Schema.Types.ObjectId,
            ref: "subcategory",
            required: false, // ✅ optional
        },

        Options: {
            type: [Number],
            default: [1, 2, 3, 4, 5],
        },
        CreatedBy: {
            type: Schema.Types.ObjectId,
            ref: "admin",
            required: true,
        },
    },
    { timestamps: true }
);

export const questionModel = mongoose.model<IQuestion>("question", questionSchema);
