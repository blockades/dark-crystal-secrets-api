const express = require('express')
const bodyParser = require('body-parser')

const Controllers = require('./controllers/')
const Routes = require('../config/routes')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const controllers = Controllers()
const routes = Routes(app, controllers)

exports = module.exports = app
