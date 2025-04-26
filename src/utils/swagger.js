const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BrainyMath API',
      version: '1.0.0',
      description: 'API Documentation for BrainyMath Educational Platform',
      contact: {
        name: 'API Support',
        email: 'support@brainymath.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Course: {
          type: 'object',
          properties: {
            course_id: {
              type: 'integer',
              example: 1
            },
            title: {
              type: 'string',
              example: 'Advanced Mathematics'
            },
            description: {
              type: 'string',
              example: 'Course covering advanced mathematical concepts'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            },
            created_by_name: {
              type: 'string',
              example: 'professor_x'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', 
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css'
    })
  );
}; 