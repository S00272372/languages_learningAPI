import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    language: string;
    level: string;
}

const courseSchema = new Schema<ICourse>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        language: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            required: true,
            enum: ["A1", "A2", "B1", "B2", "C1", "C2"]
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;