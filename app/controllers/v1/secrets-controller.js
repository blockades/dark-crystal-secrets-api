// v1/secrets-controller

const { body, validationResult } = require('express-validator/check')
const secrets = require('dark-crystal-secrets')

exports.share = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } else {
    const params = req.body

    const shards = secrets.share(
      secrets.pack(params.secret, params.label),
      parseInt(params.shards),
      parseInt(params.quorum)
    )

    res.json({ shards })
  }
}

exports.combine = (req, res, next) => {
  next()
}

exports.validate = (method) => {
  const share = [
    body('secret', "secret doesn't exist").exists(),
    body('version', "version doesn't exist").exists().matches(/^[0-9]+\.[0-9]+\.[0-9]+$/),
    body('quorum', "quorum doesn't exist").exists().matches(/^[0-9]+$/),
    body('shards', "shards doesn't exist").exists().matches(/^[0-9]+$/).custom(greaterThanOrEqualToQuorum),
    body('label', "label doesn't exist").custom(permitV1)
  ]

  const combine = []

  return { share, combine }[method]

  function greaterThanOrEqualToQuorum (value, action) {
    return parseInt(value) >= parseInt(action.req.body.quorum)
  }

  function permitV1 (value, action) {
    if (action.req.body.version === '1.0.0') return true
    else value && 'string' === typeof value
  }
}
