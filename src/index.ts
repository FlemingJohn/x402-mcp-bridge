import express from "express";
import dotenv from "dotenv";
import mcpRouter from "./mcp/server";
import { initDb } from "./db/database";
import { startIndexing } from "./indexer/paymentIndexer";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", mcpRouter);

const PORT = process.env.PORT || 4020;

const start = async () => {
    try {
        await initDb();
        startIndexing();

        app.listen(PORT, () => {
            logger.info(`x402-MCP Bridge running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
};

start();
