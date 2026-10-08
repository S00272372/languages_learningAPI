import "dotenv/config";
import { beforeAll, afterAll } from "vitest";
import connectDB, { disconnectDB } from "../src/config/database";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});