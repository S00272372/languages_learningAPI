import { describe, it, expect } from "vitest";
import { lessonSchema } from "../../src/schemas/lesson.schema";

const validLesson = {
    title: "Basic Spanish Greetings",
    content: "In this lesson students learn common Spanish greetings and introductions.",
    courseId: "6ac7e5010a5d34f3a520cf0e"
};

describe("Lesson Validation", () => {
    it("should pass for valid lesson data", () => {
        expect(() => lessonSchema.parse(validLesson)).not.toThrow();
    });

    it("should fail when title is too short", () => {
        expect(() =>
            lessonSchema.parse({
                ...validLesson,
                title: "A"
            })
        ).toThrow();
    });

    it("should fail when content is too short", () => {
        expect(() =>
            lessonSchema.parse({
                ...validLesson,
                content: "Short"
            })
        ).toThrow();
    });

    it("should fail when courseId is invalid", () => {
        expect(() =>
            lessonSchema.parse({
                ...validLesson,
                courseId: "invalid-id"
            })
        ).toThrow();
    });

    it("should fail when title is missing", () => {
        const { title, ...lessonWithoutTitle } = validLesson;

        expect(() =>
            lessonSchema.parse(lessonWithoutTitle)
        ).toThrow();
    });

    it("should fail when courseId is missing", () => {
        const { courseId, ...lessonWithoutCourseId } = validLesson;

        expect(() =>
            lessonSchema.parse(lessonWithoutCourseId)
        ).toThrow();
    });
});