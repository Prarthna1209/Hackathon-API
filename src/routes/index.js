/* istanbul ignore file */
/** index.js packages various routers into the express app (passed in as part
 * of require
 ****************************************************************************/
const swaggerUi = require('swagger-ui-express');
const options = require('../../swagger.json');
const swaggerJsDoc = require('swagger-jsdoc');
const location = require('./location');
const speedLimits = require('./speedLimits');
const { PORT } = process.env;
//Build server swagger URL from ENV variable
options.definition.servers.push({ "url": process.env.SWAGGER_BASE_URL ? `${process.env.SWAGGER_BASE_URL}` : `http://localhost:${PORT ? PORT : 3000}` });
const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use((req, res, next) => {
        // Website you wish to allow to connect
        res.header('Access-Control-Allow-Origin', '*');
        // Request headers you wish to allow
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    if (process.env.LOCAL_ENV === 'TRUE') {
        const { setLocal } = require('./middleware');
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
        app.use(setLocal());
    }
    else {
        // authorize all the endpoints (excluding api-docs)
        const { dsiAuthorizer, jwtDecoder, getUsers } = require('./middleware');
        // const users = getUsers();
        const basicAuth = require('express-basic-auth');
        app.use(basicAuth({ users }), dsiAuthorizer);
        app.use(jwtDecoder('x-jwt-assertion'));
    }
    app.use('/location', location);
    app.use('/speedLimits', speedLimits);
};
