// /shards-controller

const { body, validationResult } = require('express-validator/check')
const secrets = require('dark-crystal-secrets/v1')

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
      .json({ shard: params.shard })
  }
}

exports.validate = (method) => {
  return {
    'verify': [
      body('shard').isString().withMessage("'shard' must be a string"),
      body('shard').custom(isValidShard).withMessage("invalid shard format")
    ]
  }[method]

  function isValidShard (value, action) {
    return secrets.validateShard(value)
  }
}
