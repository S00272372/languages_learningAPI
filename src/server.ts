import express from "express";
import "dotenv/config";
import connectDB from "./config/database";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Language Learning API is running"
    });
});

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

startServer();