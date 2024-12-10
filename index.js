const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// 1. Configuración de GraphQL
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "¡Hola Mundo desde GraphQL!",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// 2. Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentación",
      version: "1.0.0",
      description: "API de ejemplo con Swagger y GraphQL",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./index.js"], // Cambia esto según la estructura de tu proyecto
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

(async () => {
  const app = express();

  // 3. Endpoint REST con anotaciones para Swagger
  /**
   * @swagger
   * /api/saludo:
   *   get:
   *     summary: Devuelve un saludo desde REST
   *     responses:
   *       200:
   *         description: Respuesta exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensaje:
   *                   type: string
   *                   example: "¡Hola Mundo desde REST!"
   */
  app.get("/api/saludo", (req, res) => {
    res.json({ mensaje: "¡Hola Mundo desde REST!" });
  });

  // 4. Integrar Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // 5. Integrar GraphQL
  await server.start();
  server.applyMiddleware({ app });

  // 6. Iniciar servidor
  app.listen(4000, () => {
    console.log("Servidor corriendo en http://localhost:4000");
    console.log("Swagger disponible en http://localhost:4000/api-docs");
    console.log("GraphQL disponible en http://localhost:4000/graphql");
  });
})();
