import Course, { ICourse } from '../models/course.model';
import { CourseInput } from '../schemas/course.schema';

export class CourseService {
  async getAllCourses(language?: string, level?: string): Promise<ICourse[]> {
    const filter: Record<string, string> = {};

    if (language && language.trim() !== "") {
      filter.language = language;
    }

    if (level && level.trim() !== "") {
      filter.level = level;
    }

    return await Course.find(filter).sort({ createdAt: -1 });
  }

  async getCourseById(id: string): Promise<ICourse | null> {
    return await Course.findById(id);
  }

  async createCourse(courseData: CourseInput): Promise<ICourse> {
    const course = new Course(courseData);
    return await course.save();
  }

  async updateCourse(id: string, courseData: CourseInput): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(id, courseData, {
      returnDocument: "after",
      runValidators: true
    });
  }

  async deleteCourse(id: string): Promise<ICourse | null> {
    return await Course.findByIdAndDelete(id);
  }
}