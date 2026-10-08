import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";

import app from "../../src/app";
import Course from "../../src/models/course.model";

let courseId: string;

const testCourse = {
    title: "German Beginner",
    description: "A beginner course for learning German.",
    language: "German",
    level: "A1"
};

describe("Course API", () => {
    
    afterAll(async () => {
        if (courseId) {
            await Course.findByIdAndDelete(courseId);
        }

    });

    it("POST /api/courses should create a course", async () => {
        const response = await request(app)
            .post("/api/courses")
            .send(testCourse);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe(testCourse.title);
        expect(response.body.language).toBe(testCourse.language);

        courseId = response.body._id;
    });

    it("POST /api/courses should reject invalid data", async () => {
        const response = await request(app)
            .post("/api/courses")
            .send({
                title: "A",
                description: "Hi",
                language: "German",
                level: "D5"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
    });

    it("GET /api/courses should return courses", async () => {
        const response = await request(app)
            .get("/api/courses");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("GET /api/courses/:id should return one course", async () => {
        const response = await request(app)
            .get(`/api/courses/${courseId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(courseId);
    });

    it("GET /api/courses/:id should return 404 for missing course", async () => {
        const response = await request(app)
            .get("/api/courses/000000000000000000000000");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Course not found");
    });

    it("PUT /api/courses/:id should update a course", async () => {
        const response = await request(app)
            .put(`/api/courses/${courseId}`)
            .send({
                title: "German Beginner Updated",
                description: "An updated beginner course for learning German.",
                language: "German",
                level: "A2"
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("German Beginner Updated");
        expect(response.body.level).toBe("A2");
    });

    it("PUT /api/courses/:id should reject invalid data", async () => {
        const response = await request(app)
            .put(`/api/courses/${courseId}`)
            .send({
                title: "A",
                description: "Hi",
                language: "German",
                level: "D5"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
    });

    it("PUT /api/courses/:id should return 404 for missing course", async () => {
        const response = await request(app)
            .put("/api/courses/000000000000000000000000")
            .send(testCourse);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Course not found");
    });

    it("DELETE /api/courses/:id should delete a course", async () => {
        const createResponse = await request(app)
            .post("/api/courses")
            .send({
                title: "Temporary Course",
                description: "Temporary course used for testing.",
                language: "French",
                level: "A1"
            });

        const temporaryId = createResponse.body._id;

        const response = await request(app)
            .delete(`/api/courses/${temporaryId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            "Course deleted successfully"
        );
    });

    it("DELETE /api/courses/:id should return 404 for missing course", async () => {
        const response = await request(app)
            .delete("/api/courses/000000000000000000000000");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Course not found");
    });
});