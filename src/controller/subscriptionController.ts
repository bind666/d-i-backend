import { Request, Response } from "express";
import { subscriptionModel } from "../model/subscription";
import assetModel from "../model/assets";
import mongoose from "mongoose";
import { responseHandler } from "../middleware/responseHandler";
import asyncHandler from "express-async-handler";

// ✅ Create a subscription (before payment)
export const createSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { SubscriberType, SubscriberId, Apps } = req.body;

    if (!["user", "organization"].includes(SubscriberType)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Invalid subscriber type",
        });
    }

    // Calculate totals
    let totalUsers = 0;
    let totalAmount = 0;

    for (const app of Apps) {
        const asset = await assetModel.findById(app.AppId);
        if (!asset) {
            return responseHandler.out(req, res, {
                statusCode: 404,
                status: false,
                message: "App not found",
            });
        }

        const quantity = SubscriberType === "user" ? 1 : app.Quantity;
        totalUsers += quantity;
        totalAmount += asset.PricePerMonth * quantity;
    }

    const subscription = new subscriptionModel({
        SubscriberType,
        SubscriberId,
        Apps,
        TotalUsers: totalUsers,
        TotalAmount: totalAmount,
        Status: "pending",
    });

    await subscription.save();

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Subscription created. Proceed to payment.",
        data: subscription,
    });
});

// ✅ Get subscription by ID
export const getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Invalid subscription id",
        });
    }

    const subscription = await subscriptionModel.findById(id).populate("Apps.AppId");
    if (!subscription) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Subscription not found",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: "Subscription fetched successfully",
        data: subscription,
    });
});
