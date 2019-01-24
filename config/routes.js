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

  // V2 Routes
  router.post(
    '/v2/secrets/share',
    v2.secrets.validate('share'),
    v2.secrets.share
  )

  router.post(
    '/v2/secrets/combine',
    v2.secrets.validate('combine'),
    v2.secrets.combine
  )

  router.post(
    '/v2/secrets/verify',
    v2.secrets.validate('verify'),
    v2.secrets.verify
  )

  router.post(
    '/v2/shards/verify',
    v2.shards.validate('verify'),
    v2.shards.verify
  )
}

