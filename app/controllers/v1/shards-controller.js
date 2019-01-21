const { verify } = require('dark-crystal-secrets')

exports.verify = (req, res) => {
}

exports.validate = (method) => {
  return {
    'verify': []
  }[method]
}
