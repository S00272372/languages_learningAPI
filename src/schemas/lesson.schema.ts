import { z } from "zod";

export const lessonSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must not exceed 100 characters"),

    content: z
        .string()
        .min(10, "Content must be at least 10 characters long")
        .max(5000, "Content must not exceed 5000 characters"),

    courseId: z
        .string()
        .regex(
            /^[0-9a-fA-F]{24}$/,
            "courseId must be a valid MongoDB ObjectId"
        )
});

export type LessonInput = z.infer<typeof lessonSchema>;

export const createLessonZSchema = z.object({
    body: lessonSchema
});

export const updateLessonZSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
    }),
    body: lessonSchema
});

export const lessonParamsSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
    })
});

export const lessonQuerySchema = z.object({
    query: z.object({
        courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional()
    })
});