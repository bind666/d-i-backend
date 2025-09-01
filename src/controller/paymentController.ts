import { Request, Response } from "express";
import Stripe from "stripe";
import { paymentModel } from "../model/paymentModel";
import { subscriptionModel } from "../model/subscription";
import Config from "../config/config";
import { responseHandler } from "../middleware/responseHandler";
import asyncHandler from "express-async-handler";
import { PaymentIntentWithCharges } from "../types";

const stripe = new Stripe(Config.STRIPE_SECRET_KEY as string, {});

// ✅ Create a payment intent for subscription
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionId } = req.body;

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "Subscription not found",
        });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: subscription.TotalAmount * 100,
        currency: "usd",
        automatic_payment_methods: { enabled: true, allow_redirects: "never" },
        metadata: { subscriptionId: subscription._id.toString() },
    });

    const payment = new paymentModel({
        SubscriptionId: subscription._id,
        Amount: subscription.TotalAmount,
        Currency: "usd",
        TransactionId: paymentIntent.id,
        PaymentStatus: "pending",
    });

    await payment.save();

    return responseHandler.out(req, res, {
        statusCode: 201,
        status: true,
        message: "Payment intent created successfully",
        data: {
            clientSecret: paymentIntent.client_secret,
            payment,
        },
    });
});

// Confirm payment manually (DEV ONLY)

export const confirmPaymentDev = asyncHandler(async (req: Request, res: Response) => {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent with expanded charges
    const paymentIntent = (await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["charges"],
    })) as PaymentIntentWithCharges;

    if (!paymentIntent) {
        return responseHandler.out(req, res, {
            statusCode: 404,
            status: false,
            message: "PaymentIntent not found",
        });
    }

    if (paymentIntent.status === "succeeded") {
        await paymentModel.findOneAndUpdate(
            { TransactionId: paymentIntent.id },
            {
                PaymentStatus: "success",
                ReceiptUrl: paymentIntent.charges?.data[0]?.receipt_url ?? null,
            }
        );

        await subscriptionModel.findByIdAndUpdate(paymentIntent.metadata.subscriptionId, {
            Status: "active",
            StartDate: new Date(),
            ExpiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        });

        return responseHandler.out(req, res, {
            statusCode: 200,
            status: true,
            message: "Payment confirmed and subscription activated",
        });
    }

    if (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "canceled") {
        await paymentModel.findOneAndUpdate(
            { TransactionId: paymentIntent.id },
            { PaymentStatus: "failed" }
        );

        await subscriptionModel.findByIdAndUpdate(paymentIntent.metadata.subscriptionId, {
            Status: "failed",
        });

        return responseHandler.out(req, res, {
            statusCode: 400,
            status: false,
            message: "Payment failed",
        });
    }

    return responseHandler.out(req, res, {
        statusCode: 200,
        status: true,
        message: `Payment is still in status: ${paymentIntent.status}`,
    });
});
