module.exports = (router, controllers) => {
  router.post('/v1/secrets/share', controllers.secrets.validate('share'), controllers.secrets.share)
  router.post('/v1/secrets/combine', controllers.secrets.validate('combine'), controllers.secrets.combine)
  router.post('/v1/secrets/verify', controllers.secrets.validate('verify'), controllers.secrets.verify)
  router.post('/v1/shards/verify', controllers.shards.validate('verify'), controllers.shards.verify)
}

