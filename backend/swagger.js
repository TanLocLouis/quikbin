const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Quikbin API Swagger',
    description: 'This is the Swagger documentation for the Quikbin API. It provides details about the available endpoints, request parameters, and response formats.',
    version: '1.0.0',
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

// This generates the file
swaggerAutogen(outputFile, routes).then(() => {
  console.log('Swagger file generated successfully');
});