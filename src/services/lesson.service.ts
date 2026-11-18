import mongoose from 'mongoose';
import Lesson, { ILesson } from '../models/lesson.model';
import Course from '../models/course.model';
import { NotFoundError } from '../apperrors';
import { LessonInput } from '../schemas/lesson.schema';

export class LessonService {
  async getAllLessons(courseId?: string): Promise<ILesson[]> {
    const filter: Record<string, mongoose.Types.ObjectId> = {};

    if (courseId) {
      filter.courseId = new mongoose.Types.ObjectId(courseId);
    }

    return await Lesson.find(filter).sort({ createdAt: -1 });
  }

  async getLessonById(id: string): Promise<ILesson> {
    const lesson = await Lesson.findById(id);

    if (!lesson) throw new NotFoundError('Lesson');

    return lesson;
  }

  async createLesson(lessonData: LessonInput): Promise<ILesson> {
    const courseExists = await Course.findById(lessonData.courseId);

    if (!courseExists) throw new NotFoundError('Course');

    const lesson = new Lesson({
      ...lessonData,
      courseId: new mongoose.Types.ObjectId(lessonData.courseId)
    });
    return await lesson.save();
  }

  async updateLesson(id: string, lessonData: LessonInput): Promise<ILesson> {
    const courseExists = await Course.findById(lessonData.courseId);

    if (!courseExists) throw new NotFoundError('Course');

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      {
        ...lessonData,
        courseId: new mongoose.Types.ObjectId(lessonData.courseId)
      },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!lesson) throw new NotFoundError('Lesson');

    return lesson;
  }

  async deleteLesson(id: string): Promise<void> {
    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) throw new NotFoundError('Lesson');
  }
}