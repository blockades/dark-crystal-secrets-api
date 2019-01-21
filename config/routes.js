module.exports = (router, controllers) => {
  const { v1, v2 } = controllers

  // V1 Routes
  router.post(
    '/v1/secrets/share',
    v1.secrets.validate('share'),
    v1.secrets.share
  )

  router.post(
    '/v1/secrets/combine',
    v1.secrets.validate('combine'),
    v1.secrets.combine
  )

  router.post(
    '/v1/shards/verify',
    v1.shards.validate('verify'),
    v1.shards.verify
  )
}

