import express from "express";
import { confirmPaymentDev, createPaymentIntent } from "../controller/paymentController";
import { auth } from "../middleware/auth";

const paymentRouter = express.Router();

// Create Stripe PaymentIntent for subscription
paymentRouter.post("/create-intent", auth, createPaymentIntent);
paymentRouter.post("/confirm-payment", auth, confirmPaymentDev);

// Stripe Webhook (⚠️ raw body required for signature verification)
// paymentRouter.post(
//     "/webhook",
//     bodyParser.raw({ type: "application/json" }), // special parser for Stripe
//     stripeWebhook
// );

export { paymentRouter };
