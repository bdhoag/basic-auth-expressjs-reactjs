import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Intern Assignment API",
      version: "1.0.0",
      description:
        "REST API with JWT authentication for the Full-stack Intern Assignment",
    },
    servers: [
      {
        url: `http://localhost:${process.env.APP_PORT || 5000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "d1936b97-1014-4dbd-a1dd-faa14c8f3ebc",
            },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refreshToken: { type: "string", example: "a1b2c3d4e5f6..." },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error description" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
}

const swaggerSpec = swaggerJsdoc(options)

export { swaggerSpec }
