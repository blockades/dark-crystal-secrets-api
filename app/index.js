const port = process.env.PORT || 3000
const hostname = process.env.HOST || 'localhost'

var host
if (process.env.NODE_ENV === 'development') host = `localhost:${port}`
else host = `${hostname}:${port}`

const express = require('express')
const bodyParser = require('body-parser')

const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../docs/swagger.json')
swaggerDocument.host = host

const Controllers = require('./controllers/')
const Routes = require('../config/routes')

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

Routes(router, Controllers())

app.use('/', router)

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
  customCss: require('../docs/swagger.css.js')()
}))

exports = module.exports = app
