const express = require('express')
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

const Controllers = require('./controllers/')
const Routes = require('../config/routes')

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routes = Routes(router, Controllers())

app.use("/", router)
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

exports = module.exports = app
