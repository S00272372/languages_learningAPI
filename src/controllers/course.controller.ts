import { Request, Response } from "express";
import mongoose from "mongoose";
import { CourseService } from "../services/course.service";
import { courseSchema } from "../schemas/course.schema";


const courseService = new CourseService();
/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter courses by language
 *       - in: query
 *         name: level
 *         required: false
 *         schema:
 *           type: string
 *           enum: [A1, A2, B1, B2, C1, C2]
 *         description: Filter courses by level
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
 *       500:
 *         description: Internal server error
 */

// GET /api/courses
export const getCourses = async (req: Request, res: Response): Promise<void> => {
    const { language, level } = req.query;

    const courses = await courseService.getAllCourses(
        typeof language === "string" ? language : undefined,
        typeof level === "string" ? level : undefined
    );

    res.status(200).json(courses);
};

// GET /api/courses/:id
/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course found
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({
            message: "Invalid course ID"
        });
        return;
    }

    const course = await courseService.getCourseById(id);

    res.status(200).json(course);
};

// POST /api/courses

/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - language
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *                 example: German Beginner
 *               description:
 *                 type: string
 *                 example: A beginner course for learning German.
 *               language:
 *                 type: string
 *                 example: German
 *               level:
 *                 type: string
 *                 enum: [A1, A2, B1, B2, C1, C2]
 *                 example: A1
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

export const createCourse = async (req: Request, res: Response): Promise<void> => {
    const validation = courseSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: validation.error.issues
        });
        return;
    }

    const course = await courseService.createCourse(validation.data);

    res.status(201).json(course);
};

// PUT /api/courses/:id

/**
 * @openapi
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - language
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *                 example: German Beginner Updated
 *               description:
 *                 type: string
 *                 example: An updated beginner course for learning German.
 *               language:
 *                 type: string
 *                 example: German
 *               level:
 *                 type: string
 *                 enum: [A1, A2, B1, B2, C1, C2]
 *                 example: A2
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Invalid course ID or validation failed
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({
            message: "Invalid course ID"
        });
        return;
    }

    const validation = courseSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: validation.error.issues
        });
        return;
    }

    const course = await courseService.updateCourse(id, validation.data);

    res.status(200).json(course);
};

// DELETE /api/courses/:id

/**
 * @openapi
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({
            message: "Invalid course ID"
        });
        return;
    }

    await courseService.deleteCourse(id);

    res.status(200).json({
        message: "Course deleted successfully"
    });
};