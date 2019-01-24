const { describe } = require('tape-plus')
const supertest = require('supertest')

const { app } = require('../../test-helper')

describe('POST /v1/shards/verify', (context) => {
  let server, request
  let params

  context.beforeEach((c) => {
    server = app()
    request = supertest.agent(server)

    params = { shard: '80104424cf070d06548da4dd40d47f4c156' }
  })

  context.afterEach((c) => {
    server.close()
  })

  context('valid parameters', (assert, done) => {
    request.post('/v1/shards/verify')
      .send(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.equal(typeof response.body.shard, 'string')
        assert.equal(response.body.shard, params.shard)
        done()
      })
  })
})
