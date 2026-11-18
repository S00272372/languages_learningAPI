import { Router } from "express";

import {
    getLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
} from "../controllers/lesson.controller";
import { validate } from "../middleware/validate.middleware";
import {
    createLessonZSchema,
    updateLessonZSchema,
    lessonParamsSchema,
    lessonQuerySchema
} from "../schemas/lesson.schema";

const router = Router();

router.get("/", validate(lessonQuerySchema), getLessons);
router.get("/:id", validate(lessonParamsSchema), getLessonById);
router.post("/", validate(createLessonZSchema), createLesson);
router.put("/:id", validate(updateLessonZSchema), updateLesson);
router.delete("/:id", validate(lessonParamsSchema), deleteLesson);

export default router;