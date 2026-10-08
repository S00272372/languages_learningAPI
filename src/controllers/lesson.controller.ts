import { Request, Response } from "express";
import mongoose from "mongoose";
import Lesson from "../models/lesson.model";
import Course from "../models/course.model";
import { lessonSchema } from "../schemas/lesson.schema";

// GET /api/lessons
/**
 * @openapi
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter lessons by course ID
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons
 *       400:
 *         description: Invalid course ID
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/lessons/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     responses:
 *       200:
 *         description: Lesson found
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags:
 *       - Lessons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Basic Spanish Greetings
 *               content:
 *                 type: string
 *                 example: In this lesson students learn common Spanish greetings and introductions.
 *               courseId:
 *                 type: string
 *                 example: 6ac7e5010a5d34f3a520cf0e
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Spanish Greetings
 *               content:
 *                 type: string
 *                 example: Updated content for the Spanish greetings lesson.
 *               courseId:
 *                 type: string
 *                 example: 6ac7e5010a5d34f3a520cf0e
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         description: Invalid lesson ID or validation failed
 *       404:
 *         description: Lesson or course not found
 *       500:
 *         description: Internal server error
 */
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
                returnDocument: "after",
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

/**
 * @openapi
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
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