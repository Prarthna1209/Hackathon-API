const server = require('./src/app');
const { INTERNAL_SERVER_ERROR, OK } = require('./src/utils/codes');

const fs = require('fs');
const swaggerJsDoc = require('swagger-jsdoc');
const options = require('./swagger.json');


const port = process.env.PORT || 3002;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const run = async () => {
    try {
        let specs = swaggerJsDoc(options);
        let filepath = process.env.SWAGGER_DOCUMENT_PATH + process.env.SWAGGER_DOCUMENT_FILENAME;
        fs.mkdirSync(process.env.SWAGGER_DOCUMENT_PATH, { recursive: true });
        fs.writeFileSync(filepath, JSON.stringify(specs, null, 4), 'utf8');
        
        server.listen(port, () => {
            console.log(`Server is up on port ${port}`);
        });
    } catch (error) {
        console.error(`Failed to start the server: ${error}`);
    }
};

run();