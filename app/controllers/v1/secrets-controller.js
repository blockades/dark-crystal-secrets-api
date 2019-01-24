// v1/secrets-controller

const { body, validationResult } = require('express-validator/check')
const secrets = require('dark-crystal-secrets/v1')

exports.share = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() })

  } else {
    const params = req.body

    const shards = secrets.share(
      secrets.pack(params.secret, params.label),
      parseInt(params.shards),
      parseInt(params.quorum)
    )

    return res
      .status(201)
      .json({ shards })
  }
}

exports.combine = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() })

  } else {
    const params = req.body

    const secret = secrets.combine(params.shards)

    return res
      .status(201)
      .json({ secret })
  }
}

exports.validate = (method) => {
  const share = [
    body('secret', "secret doesn't exist").exists().isString(),
    body('quorum', "quorum doesn't exist").exists().matches(/^[0-9]+$/),
    body('shards', "shards doesn't exist").exists().matches(/^[0-9]+$/).custom(greaterThanOrEqualToQuorum),
  ]

  const combine = [
    body('shards', "shards doesn't exist").exists().isArray(),
    body('shards', "shards are not valid").custom(validShards)
  ]

  return { share, combine }[method]

  function greaterThanOrEqualToQuorum (value, action) {
    return parseInt(value) >= parseInt(action.req.body.quorum)
  }

  function validShards (array, action) {
    return array
      .map(secrets.validateShard)
      .filter(Boolean)
      .length === array.length
  }
}
