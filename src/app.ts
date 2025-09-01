import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { errorHandler } from "./middleware/errorHandler";
import { userRouter } from "./routes/userRoutes";
import { organizationRouter } from "./routes/organizationRoutes";
import { adminRrouter } from "./routes/adminRoutes";
import { assetsRouter } from "./routes/assetRoutes";
import { departmentRouter } from "./routes/departmentRoutes";
import { categoryRouter } from "./routes/categoryRoutes";
import { questionRouter } from "./routes/questionRoutes";
import { assesmentRouter } from "./routes/assessmentRoutes";
import { assesmentStepsRouter } from "./routes/assessmentStepRoutes";
import { assessmentResultRouter } from "./routes/assessmentResultRoutes";
import { subCategoryRouter } from "./routes/subcategoryRoutes";
// import { responseHandler } from "./middleware/responseHandler";

const app = express();

app.use(
    cors({
        origin: "*", // allow all origins
        credentials: true, // ⚠️ This won’t work with "*" (must specify domains for cookies/auth)
    })
);


app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/admin", adminRrouter);
app.use("/api/department", departmentRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/question", questionRouter);
app.use("/api/assesmentsteps", assesmentStepsRouter);
app.use("/api/assesment", assesmentRouter);
app.use("/api/assesmentresult", assessmentResultRouter);

app.get("/", (_req, res) => {
    res.send("Diversity & Inclusion App Backend Running");
});

// app.use(errorHandler);
// app.use(responseHandler)

export default app;
