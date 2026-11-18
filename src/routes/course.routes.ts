import { Router } from "express";
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} from "../controllers/course.controller";
import { validate } from "../middleware/validate.middleware";
import {
    createCourseZSchema,
    updateCourseZSchema,
    courseParamsSchema
} from "../schemas/course.schema";

const router = Router();

router.get("/", getCourses);
router.get("/:id", validate(courseParamsSchema), getCourseById);
router.post("/", validate(createCourseZSchema), createCourse);
router.put("/:id", validate(updateCourseZSchema), updateCourse);
router.delete("/:id", validate(courseParamsSchema), deleteCourse);

export default router;