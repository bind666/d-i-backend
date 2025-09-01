import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        SubscriptionId: {
            type: Schema.Types.ObjectId,
            ref: "subscription",
            required: true,
        },
        Amount: {
            type: Number,
            required: true,
        },
        Currency: {
            type: String,
            default: "usd",
        },
        PaymentGateway: {
            type: String,
            enum: ["stripe"],
            default: "stripe",
        },
        TransactionId: {
            type: String, // Stripe payment_intent.id
            required: true,
        },
        PaymentStatus: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        ReceiptUrl: {
            type: String, // Stripe receipt URL
        },
    },
    { timestamps: true }
);

export const paymentModel = mongoose.model("payment", paymentSchema);
