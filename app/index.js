const express = require('express')
const bodyParser = require('body-parser')

const Controllers = require('./controllers/')
const Routes = require('../config/routes')

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routes = Routes(router, Controllers())

app.use('/', router)

exports = module.exports = app
