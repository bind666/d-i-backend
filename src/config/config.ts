import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const Config = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.MONGO_URI || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "secret123",
};

if (!Config.DB_URI) {
    throw new Error("❌ MONGO_URI not set in environment variables");
}

export default Config;
