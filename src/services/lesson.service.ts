import mongoose from 'mongoose';
import Lesson, { ILesson } from '../models/lesson.model';
import { LessonInput } from '../schemas/lesson.schema';

export class LessonService {
  async getAllLessons(courseId?: string): Promise<ILesson[]> {
    const filter: Record<string, mongoose.Types.ObjectId> = {};

    if (courseId) {
      filter.courseId = new mongoose.Types.ObjectId(courseId);
    }

    return await Lesson.find(filter).sort({ createdAt: -1 });
  }

  async getLessonById(id: string): Promise<ILesson | null> {
    return await Lesson.findById(id);
  }

  async createLesson(lessonData: LessonInput): Promise<ILesson> {
    const lesson = new Lesson({
      ...lessonData,
      courseId: new mongoose.Types.ObjectId(lessonData.courseId)
    });
    return await lesson.save();
  }

  async updateLesson(id: string, lessonData: LessonInput): Promise<ILesson | null> {
    return await Lesson.findByIdAndUpdate(
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
  }

  async deleteLesson(id: string): Promise<ILesson | null> {
    return await Lesson.findByIdAndDelete(id);
  }
}