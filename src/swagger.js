const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MathSphere Security API',
      version: '1.0.0',
      description: 'API for managing security features',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginHistory: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              format: 'uuid'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            deviceType: {
              type: 'string',
              enum: ['desktop', 'mobile', 'tablet']
            },
            ipAddress: {
              type: 'string'
            },
            location: {
              type: 'string'
            },
            success: {
              type: 'boolean'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger; 