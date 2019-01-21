module.exports = (app, controllers) => {
  const { v1, v2 } = controllers

  app.route('/v1/secrets/share').post(v1.secrets.share)
  app.route('/v1/secrets/combine').post(v1.secrets.combine)
  app.route('/v1/shards/verify').post(v1.shards.verify)
}

