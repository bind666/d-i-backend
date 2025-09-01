import express from "express";
import { createSubscription, getSubscriptionById } from "../controller/subscriptionController";
import { auth } from "../middleware/auth";

const subscriptionRouter = express.Router();

// Create subscription (user/org chooses app & quantity)
subscriptionRouter.post("/create", auth, createSubscription);

// Get subscription by ID
subscriptionRouter.get("/:id", auth, getSubscriptionById);

export { subscriptionRouter };

//sample data for subscription
// {
//   "SubscriberType": "user",
//   "SubscriberId": "64fa8c13c9e8e2234aa3a7b1",
//   "Apps": [
//     { "AppId": "64fb12d34a7b21c3d9c91f01" }
//   ]
// }

// {
//   "SubscriberType": "organization",
//   "SubscriberId": "64fb1a23a1a9c234ee771234",
//   "Apps": [
//     { "AppId": "64fb12d34a7b21c3d9c91f01", "Quantity": 5 },
//     { "AppId": "64fb12d34a7b21c3d9c91f02", "Quantity": 3 }
//   ]
// }
