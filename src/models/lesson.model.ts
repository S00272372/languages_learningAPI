import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
    title: string;
    content: string;
    courseId: mongoose.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;