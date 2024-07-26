import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Definindo as opções para o swagger-jsdoc
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication Service API',
      version: '1.0.0',
      description: 'This API for managing user authentication.',
      contact: {
        name: 'marcitudev',
      }
    },
  },
  apis: ['src/controllers/*.ts', 'shared-service/models/*.ts'], // Caminho para os arquivos de documentação
};

// Inicializando swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};