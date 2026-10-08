import { describe, it, expect, beforeAll, afterAll } from "vitest";import request from "supertest";

import app from "../../src/app";
import Lesson from "../../src/models/lesson.model";
import Course from "../../src/models/course.model";

describe("Lesson API", () => {
    let courseId: string;
    let lessonId: string;

    beforeAll(async () => {
        const course = await Course.create({
            title: "Test Spanish Course",
            description: "Course created for integration testing",
            language: "Spanish",
            level: "A1"
        });

        courseId = course._id.toString();
    });

    afterAll(async () => {
        if (lessonId) {
            await Lesson.findByIdAndDelete(lessonId);
        }

        if (courseId) {
            await Course.findByIdAndDelete(courseId);
        }
    });

    it("POST /api/lessons should create a lesson", async () => {
        const response = await request(app)
            .post("/api/lessons")
            .send({
                title: "Basic Spanish Greetings",
                content: "In this lesson students learn common Spanish greetings and introductions.",
                courseId
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.title).toBe("Basic Spanish Greetings");

        lessonId = response.body._id;
    });

    it("POST /api/lessons should reject invalid data", async () => {
        const response = await request(app)
            .post("/api/lessons")
            .send({
                title: "x",
                content: "short",
                courseId: "invalid-id"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
    });

    it("GET /api/lessons should return lessons", async () => {
        const response = await request(app)
            .get("/api/lessons");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("GET /api/lessons/:id should return one lesson", async () => {
        const response = await request(app)
            .get(`/api/lessons/${lessonId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(lessonId);
    });

    it("GET /api/lessons/:id should return 404 for missing lesson", async () => {
        const response = await request(app)
            .get("/api/lessons/000000000000000000000000");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Lesson not found");
    });

    it("PUT /api/lessons/:id should update a lesson", async () => {
        const response = await request(app)
            .put(`/api/lessons/${lessonId}`)
            .send({
                title: "Updated Spanish Greetings",
                content: "Updated content for the Spanish greetings lesson.",
                courseId
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Spanish Greetings");
    });

    it("PUT /api/lessons/:id should reject invalid data", async () => {
        const response = await request(app)
            .put(`/api/lessons/${lessonId}`)
            .send({
                title: "x",
                content: "short",
                courseId: "invalid-id"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
    });

    it("PUT /api/lessons/:id should return 404 for missing lesson", async () => {
        const response = await request(app)
            .put("/api/lessons/000000000000000000000000")
            .send({
                title: "Updated Lesson",
                content: "This is updated lesson content.",
                courseId
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Lesson not found");
    });

    it("DELETE /api/lessons/:id should delete a lesson", async () => {
        const createResponse = await request(app)
            .post("/api/lessons")
            .send({
                title: "Lesson To Delete",
                content: "This lesson will be deleted during the test.",
                courseId
            });

        expect(createResponse.status).toBe(201);

        const deleteId = createResponse.body._id;

        const response = await request(app)
            .delete(`/api/lessons/${deleteId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Lesson deleted successfully");
    });

    it("DELETE /api/lessons/:id should return 404 for missing lesson", async () => {
        const response = await request(app)
            .delete("/api/lessons/000000000000000000000000");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Lesson not found");
    });
});
