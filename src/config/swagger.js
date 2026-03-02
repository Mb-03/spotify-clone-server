const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spotify Clone API",
      version: "1.0.0",
      description: "Backend API documentation for Spotify Clone (User Module)",
      contact: {
        name: "Spotify Clone Team",
        email: "admin@spotifyclone.com",
      },
    },

    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },

      schemas: {
        // =========================
        // User Schema
        // =========================
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "65f1c9b2e9a1a2b3c4d5e6f7",
            },
            name: {
              type: "string",
              example: "Temo Arabuli",
            },
            email: {
              type: "string",
              example: "temo@email.com",
            },
            isAdmin: {
              type: "boolean",
              example: false,
            },
            profilePicture: {
              type: "string",
              example:
                "https://res.cloudinary.com/demo/image/upload/v123456789/profile.jpg",
            },
          },
        },

        // =========================
        // Register Request
        // =========================
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Temo Arabuli",
            },
            email: {
              type: "string",
              example: "temo@email.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },

        // =========================
        // Login Request
        // =========================
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "temo@email.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },

        // =========================
        // Auth Response
        // =========================
        AuthResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            email: {
              type: "string",
            },
            isAdmin: {
              type: "boolean",
            },
            profilePicture: {
              type: "string",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
      },
    },

    tags: [
      {
        name: "Users",
        description: "User authentication & profile management",
      },
    ],
  },

  apis: ["./src/routes/userRoutes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
