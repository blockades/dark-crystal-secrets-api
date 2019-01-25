const { describe } = require('tape-plus')
const supertest = require('supertest')

const { app } = require('../test-helper')

describe('POST /shards/verify', (context) => {
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

  context('valid with correct parameters', (assert, done) => {
    request.post('/shards/verify')
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

  context('invalid when shard is not a string', (assert, done) => {
    params.shard = 1

    request.post('/shards/verify')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'shard',
          value: params.shard,
          msg: '\'shard\' must be a string'
        }, { location: 'body',
          param: 'shard',
          value: params.shard,
          msg: 'invalid shard format'
        }])

        done()
      })
  })

  context('invalid when shard is not a valid shard', (assert, done) => {
    let v2shard = '801nrb0BnehCLCug/89VQZqwhJcSNX2gWi20i6PEDV96VxD0ocjgxIjP+/hlnMzNKi8/vASlY5UYKfWqyzvfDcO4g=='
    params.shard = v2shard

    request.post('/shards/verify')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'shard',
          value: params.shard,
          msg: 'invalid shard format'
        }])

        done()
      })
  })
})
