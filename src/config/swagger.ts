import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Language Learning API",
            version: "1.0.0",
            description: "REST API for a language learning platform"
        },

        servers: [
            {
                url: "/"
            }
        ],

        components: {
            schemas: {
                Course: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6ac7e8c90e2960397105aa69"
                        },
                        title: {
                            type: "string",
                            example: "German Beginner"
                        },
                        description: {
                            type: "string",
                            example: "A beginner course for learning German."
                        },
                        language: {
                            type: "string",
                            example: "German"
                        },
                        level: {
                            type: "string",
                            enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
                            example: "A1"
                        }
                    }
                },

                Lesson: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6ac7e546d49188bffdfa057e"
                        },
                        title: {
                            type: "string",
                            example: "Basic Spanish Greetings"
                        },
                        content: {
                            type: "string",
                            example:
                                "In this lesson students learn common Spanish greetings and introductions."
                        },
                        courseId: {
                            type: "string",
                            example: "6ac7e5010a5d34f3a520cf0e"
                        }
                    }
                }
            }
        }
    },

    apis: [
        "./src/controllers/*.ts"
    ]
};

export const swaggerSpec = swaggerJSDoc(options);