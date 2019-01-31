// secrets-controller

const { body, oneOf, validationResult } = require('express-validator/check')
const darkCrystal = require('dark-crystal-secrets')

exports.share = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() })

  } else {
    const params = req.body

    const shards = darkCrystal.share(
      darkCrystal.pack(params.secret, params.label),
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

    const secret = darkCrystal.combine(params.shards, params.version)

    return res
      .status(201)
      .json({ secret })
  }
}

exports.verify = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() })

  } else {
    const params = req.body

    const secret = darkCrystal.combine(params.shards)

    return res
      .status(201)
      .json({ valid: Boolean(secret) })
  }
}

exports.validate = (method) => {
  const share = [
    body('secret').isString().withMessage("'secret' must be a string"),
    body('quorum').isInt().withMessage("'quorum' must be an integer"),
    body('quorum').custom(quorumLessThanOne).withMessage("'quorum' must be greater than 1"),
    body('shards').isInt().withMessage("'shards' must be an integer"),
    body('shards').custom(greaterThanOrEqualToQuorum).withMessage("'shards' must be greater than or equal to provided 'quorum'"),
  ]

  const combine = [
    body('version').matches(/^[0-9]+\.[0-9]+\.[0-9]+$/).withMessage("'version' must be semantic version"),
    body('version').isIn(['1.0.0', '2.0.0']).withMessage("'version' not currently supported"),
    body('shards').isArray().withMessage("'shards' must be an array"),
    body('shards').custom(validShards).withMessage("one or more of the provided shards are not valid")
  ]

  const verify = [
    body('version').matches(/^[0-9]+\.[0-9]+\.[0-9]+$/).withMessage("'version' must be semantic version"),
    body('version').isIn(['1.0.0', '2.0.0']).withMessage("'version' not currently supported"),
    body('shards').isArray().withMessage("'shards' must be an array"),
    body('shards').custom(validShards).withMessage("one or more of the provided shards are not valid")
  ]

  return { share, combine, verify }[method]

  function greaterThanOrEqualToQuorum (value, action) {
    return parseInt(value) >= parseInt(action.req.body.quorum)
  }

  function quorumLessThanOne (value, action) {
    return value > 1
  }

  function validShards (array, action) {
    return array
      .map(shard => darkCrystal.validateShard(shard, action.req.body.version))
      .filter(Boolean)
      .length === array.length
  }
}
