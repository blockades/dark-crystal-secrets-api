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
    body('secret').isString().withMessage("'secret' must be a string"),
    body('quorum').matches(/^[0-9]+$/).withMessage("'quorum' must be an integer"),
    body('quorum').custom(quorumLessThanOne).withMessage("'quorum' must be greater than 1"),
    body('shards').matches(/^[0-9]+$/).withMessage("'shards' must be an integer"),
    body('shards').custom(greaterThanOrEqualToQuorum).withMessage("shards must be greater than or equal to provided quorum"),
  ]

  const combine = [
    body('shards').isArray().withMessage("'shards' must be an array"),
    body('shards').custom(validShards).withMessage("one or more of the provided shards are not valid")
  ]

  return { share, combine }[method]

  function greaterThanOrEqualToQuorum (value, action) {
    return parseInt(value) >= parseInt(action.req.body.quorum)
  }

  function quorumLessThanOne (value, action) {
    return value > 1
  }

  function validShards (array, action) {
    return array
      .map(secrets.validateShard)
      .filter(Boolean)
      .length === array.length
  }
}
