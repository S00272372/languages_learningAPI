import { Request, Response } from "express";
import mongoose from "mongoose";
import { LessonService } from "../services/lesson.service";
import Course from "../models/course.model";
import { lessonSchema } from "../schemas/lesson.schema";

const lessonService = new LessonService();
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
    const { courseId } = req.query;

    const lessons = await lessonService.getAllLessons(
        typeof courseId === "string" ? courseId : undefined
    );

    res.status(200).json(lessons);
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const lesson = await lessonService.getLessonById(id);

    res.status(200).json(lesson);
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
    const lesson = await lessonService.createLesson(req.body);

    res.status(201).json(lesson);
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const lesson = await lessonService.updateLesson(id, req.body);

    res.status(200).json(lesson);
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await lessonService.deleteLesson(id);

    res.status(200).json({
        message: "Lesson deleted successfully"
    });
};