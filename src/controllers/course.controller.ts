import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/course.model";
import { courseSchema } from "../schemas/course.schema";

// GET /api/courses
export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { language, level } = req.query;

        const filter: Record<string, string> = {};

        if (typeof language === "string" && language.trim() !== "") {
            filter.language = language;
        }

        if (typeof level === "string" && level.trim() !== "") {
            filter.level = level;
        }

        const courses = await Course.find(filter).sort({ createdAt: -1 });

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
};

// GET /api/courses/:id
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({
                message: "Invalid course ID"
            });
            return;
        }

        const course = await Course.findById(id);

        if (!course) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }

        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch course"
        });
    }
};

// POST /api/courses
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = courseSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: validation.error.issues
            });
            return;
        }

        const course = await Course.create(validation.data);

        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create course"
        });
    }
};

// PUT /api/courses/:id
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

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

        const course = await Course.findByIdAndUpdate(
            id,
            validation.data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }

        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update course"
        });
    }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({
                message: "Invalid course ID"
            });
            return;
        }

        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }

        res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete course"
        });
    }
};