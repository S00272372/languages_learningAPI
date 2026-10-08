import app from "./app";
import connectDB from "./config/database";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, (error) => {
            if (error) {
                if (error instanceof Error) {
                    console.error(
                        "Error starting server:",
                        error.message
                    );
                } else {
                    console.error(
                        "Error starting server:",
                        error
                    );
                }

                return;
            }

            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

startServer();