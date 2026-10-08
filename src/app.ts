import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import express, { Application, Request, Response } from "express";
import "dotenv/config";

import courseRoutes from "./routes/course.routes";
import lessonRoutes from "./routes/lesson.routes";

const app: Application = express();

app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

app.get("/", (_req: Request, res: Response) => {
    res.json({
        message: "Language Learning API is running"
    });
});

export default app;