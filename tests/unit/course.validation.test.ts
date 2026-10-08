import { describe, it, expect } from "vitest";
import { courseSchema } from "../../src/schemas/course.schema";

const validCourse = {
    title: "German Beginner",
    description: "A beginner course for learning German.",
    language: "German",
    level: "A1"
};

describe("Course Validation", () => {
    it("should pass for valid course data", () => {
        expect(() => courseSchema.parse(validCourse)).not.toThrow();
    });

    it("should fail when title is too short", () => {
        expect(() =>
            courseSchema.parse({
                ...validCourse,
                title: "A"
            })
        ).toThrow();
    });

    it("should fail when description is too short", () => {
        expect(() =>
            courseSchema.parse({
                ...validCourse,
                description: "Short"
            })
        ).toThrow();
    });

    it("should fail when language is too short", () => {
        expect(() =>
            courseSchema.parse({
                ...validCourse,
                language: "G"
            })
        ).toThrow();
    });

    it("should fail when level is invalid", () => {
        expect(() =>
            courseSchema.parse({
                ...validCourse,
                level: "D5"
            })
        ).toThrow();
    });

    it("should fail when title is missing", () => {
        const { title, ...courseWithoutTitle } = validCourse;

        expect(() =>
            courseSchema.parse(courseWithoutTitle)
        ).toThrow();
    });
});