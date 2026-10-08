import { z } from "zod";

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must not exceed 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters long")
        .max(500, "Description must not exceed 500 characters"),

    language: z
        .string()
        .min(2, "Language is required")
        .max(50, "Language must not exceed 50 characters"),

    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"])
});

export type CourseInput = z.infer<typeof courseSchema>;  