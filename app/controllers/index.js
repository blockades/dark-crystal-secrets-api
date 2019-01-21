module.exports = () => ({
  v1: {
    secrets: require('./v1/secrets-controller'),
    shards: require('./v1/shards-controller')
  },
  v2: {
    secrets: require('./v2/secrets-controller'),
    shards: require('./v2/shards-controller')
  }
})
