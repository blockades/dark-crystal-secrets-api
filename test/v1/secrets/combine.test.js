const { describe } = require('tape-plus')
const supertest = require('supertest')

const { app } = require('../../test-helper')

describe('POST /v1/secrets/combine', (context) => {
  let server, request
  let params

  context.beforeEach((c) => {
    server = app()
    request = supertest.agent(server)

    params = {
      shards: [
        '80104424cf070d06548da4dd40d47f4c156',
        '802a274f51b2fead5dd92a240a5f5545e67',
        '803a636b9ea5f4eb0f0489d94cbb2c59f42'
      ]
    }
  })

  context.afterEach((c) => {
    server.close()
  })

  context('valid with correct parameters', (assert, done) => {
    request.post('/v1/secrets/combine')
      .send(params)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.equal(typeof response.body.secret, 'string')
        assert.equal(response.body.secret, 'secret')
        done()
      })
  })

  context('invalid when shards is not an array', (assert, done) => {
    params.shards = 1

    request.post('/v1/secrets/combine')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: '\'shards\' must be an array'
        }, {
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: 'one or more of the provided shards are not valid'
        }])

        done()
      })
  })
  context('invalid when shards contains an invalid shard', (assert, done) => {
    params = { shards: [
      '80104424cf070d06548da4dd40d47f4c156',
      'invalid',
      '802a274f51b2fead5dd92a240a5f5545e67',
    ]}

    request.post('/v1/secrets/combine')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: 'one or more of the provided shards are not valid'
        }])

        done()
      })
  })
})
