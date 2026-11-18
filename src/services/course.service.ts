import Course, { ICourse } from '../models/course.model';
import { NotFoundError } from '../apperrors';
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

  async getCourseById(id: string): Promise<ICourse> {
    const course = await Course.findById(id);

    if (!course) throw new NotFoundError('Course');

    return course;
  }

  async createCourse(courseData: CourseInput): Promise<ICourse> {
    const course = new Course(courseData);
    return await course.save();
  }

  async updateCourse(id: string, courseData: CourseInput): Promise<ICourse> {
    const course = await Course.findByIdAndUpdate(id, courseData, {
      returnDocument: "after",
      runValidators: true
    });

    if (!course) throw new NotFoundError('Course');

    return course;
  }

  async deleteCourse(id: string): Promise<void> {
    const course = await Course.findByIdAndDelete(id);

    if (!course) throw new NotFoundError('Course');
  }
}