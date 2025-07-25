
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Membership Management API",
      version: "1.0.0",
    },
        components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }]
  },
apis: [__dirname + "/../routes/**/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;