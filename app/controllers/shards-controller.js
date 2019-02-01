// /shards-controller

const { body, validationResult } = require('express-validator/check')
const darkCrystal = require('dark-crystal-secrets')

exports.verify = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() })
  } else {
    const params = req.body

    return res
      .status(200)
      .json(params)
  }
}

exports.validate = (method) => {
  return {
    'verify': [
      body('version').matches(/^[0-9]+\.[0-9]+\.[0-9]+$/).withMessage("'version' must be semantic version"),
      body('version').isIn(['1.0.0', '2.0.0']).withMessage("'version' not currently supported"),
      body('shard').isString().withMessage("'shard' must be a string"),
      body('shard').custom(isValidShard).withMessage('invalid shard format')
    ]
  }[method]

  function isValidShard (value, action) {
    return darkCrystal.validateShard(value, action.req.body.version)
  }
}
