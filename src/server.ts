import express from "express";
import "dotenv/config";
import connectDB from "./config/database";
import courseRoutes from "./routes/course.routes";
import lessonRoutes from "./routes/lesson.routes";

const app = express();

app.use(express.json());
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

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