module.exports = (router, controllers) => {
  router.post('/secrets/share', controllers.secrets.validate('share'), controllers.secrets.share)
  router.post('/secrets/combine', controllers.secrets.validate('combine'), controllers.secrets.combine)
  router.post('/secrets/verify', controllers.secrets.validate('verify'), controllers.secrets.verify)
  router.post('/shards/verify', controllers.shards.validate('verify'), controllers.shards.verify)
}

