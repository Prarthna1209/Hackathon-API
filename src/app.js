/* istanbul ignore file */
/*****************************************************************************\
 * app.js packages up and configures the express server                      *
 *                                                                           *
 * @author Prarthna Chauhan                                                      *
\*****************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(express.json());
routes(app);
module.exports = app;
