import { Request, Response } from "express";
import mongoose from "mongoose";
import Lesson from "../models/lesson.model";
import Course from "../models/course.model";
import { lessonSchema } from "../schemas/lesson.schema";

// GET /api/lessons
export const getLessons = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { courseId } = req.query;

        const filter: Record<string, mongoose.Types.ObjectId> = {};

        if (typeof courseId === "string") {
            if (!mongoose.isValidObjectId(courseId)) {
                res.status(400).json({
                    message: "Invalid course ID"
                });
                return;
            }

            filter.courseId = new mongoose.Types.ObjectId(courseId);
        }

        const lessons = await Lesson.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json(lessons);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch lessons"
        });
    }
};

// GET /api/lessons/:id
export const getLessonById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({
                message: "Invalid lesson ID"
            });
            return;
        }

        const lesson = await Lesson.findById(id);

        if (!lesson) {
            res.status(404).json({
                message: "Lesson not found"
            });
            return;
        }

        res.status(200).json(lesson);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch lesson"
        });
    }
};

// POST /api/lessons
export const createLesson = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const validation = lessonSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: validation.error.issues
            });
            return;
        }

        const courseExists = await Course.findById(validation.data.courseId);

        if (!courseExists) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }

        const lesson = await Lesson.create({
            ...validation.data,
            courseId: new mongoose.Types.ObjectId(validation.data.courseId)
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create lesson"
        });
    }
};

// PUT /api/lessons/:id
export const updateLesson = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({
                message: "Invalid lesson ID"
            });
            return;
        }

        const validation = lessonSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: validation.error.issues
            });
            return;
        }

        const courseExists = await Course.findById(validation.data.courseId);

        if (!courseExists) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }

        const lesson = await Lesson.findByIdAndUpdate(
            id,
            {
                ...validation.data,
                courseId: new mongoose.Types.ObjectId(validation.data.courseId)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!lesson) {
            res.status(404).json({
                message: "Lesson not found"
            });
            return;
        }

        res.status(200).json(lesson);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update lesson"
        });
    }
};

// DELETE /api/lessons/:id
export const deleteLesson = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({
                message: "Invalid lesson ID"
            });
            return;
        }

        const lesson = await Lesson.findByIdAndDelete(id);

        if (!lesson) {
            res.status(404).json({
                message: "Lesson not found"
            });
            return;
        }

        res.status(200).json({
            message: "Lesson deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete lesson"
        });
    }
};