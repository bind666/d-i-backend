import app from "./app";
import Config from "./config/config";
import logger from "./config/logger";
import dbConnect from "./db/dbConnect";

dbConnect()
    .then(() => {
        app.listen(Config.PORT, () => {
            logger.info(`Server started on http://localhost:${Config.PORT}`);
        });
    })
    .catch((err) => {
        logger.error("❌ Server startup error: " + err);
        process.exit(1);
    });
