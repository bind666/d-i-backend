// db connection
import mongoose from "mongoose";
import Config from "../config/config";
import logger from "../config/logger";

const dbConnect = async () => {
    try {
        mongoose.connection.on("connected", () => {
            logger.info("MongoDB connected successfully.");
        });

        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB connection error: " + err);
        });

        mongoose.connection.on("disconnected", () => {
            logger.info("MongoDB disconnected.");
        });

        await mongoose.connect(Config.DB_URI);
    } catch (error) {
        logger.error(error as string);
        throw error;
    }
};

export default dbConnect;
