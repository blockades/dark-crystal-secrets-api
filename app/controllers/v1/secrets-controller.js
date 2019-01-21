const { body } = require('express-validator/check')
const { share, combine } = require('dark-crystal-secrets')

exports.share = (req, res, next) => {
  next()
}

exports.combine = (req, res, next) => {
  next()
}

exports.validate = (method) => {
  return {
    'share': [],
    'combine': []
  }[method]
}
