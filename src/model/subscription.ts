import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        SubscriberType: {
            type: String,
            enum: ["user", "organization"], // who subscribed
            required: true,
        },
        SubscriberId: {
            type: Schema.Types.ObjectId,
            refPath: "SubscriberType", // dynamically points to user/organization
            required: true,
        },
        Apps: [
            {
                AppId: {
                    type: Schema.Types.ObjectId,
                    ref: "asset",
                    required: true,
                },
                Quantity: {
                    type: Number,
                    default: 1, // individual = 1, org = seat count
                },
            },
        ],
        TotalUsers: {
            type: Number,
            required: true, // 1 for individual, sum for org
        },
        TotalAmount: {
            type: Number,
            required: true,
        },
        Status: {
            type: String,
            enum: ["pending", "active", "failed", "expired"],
            default: "pending",
        },
        StartDate: {
            type: Date,
            default: Date.now,
        },
        ExpiryDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const subscriptionModel = mongoose.model("subscription", subscriptionSchema);

// 🔗 Relationship
// subscriptionModel tracks what the user/org has access to.
// paymentModel tracks each payment attempt for that subscription.
// Each subscription can have multiple payments (renewals, retries, upgrades).
