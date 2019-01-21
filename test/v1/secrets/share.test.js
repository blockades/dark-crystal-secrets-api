const { describe } = require('tape-plus')
const supertest = require('supertest')

const { app } = require('../../test-helper')

describe('POST /v1/secrets/share', (context) => {
  let server, request
  let params

  context.beforeEach((c) => {
    server = app()
    request = supertest.agent(server)

    params = {
      secret: 'thisismysecret'
    }
  })

  context.afterEach((c) => {
    server.close()
  })

  context('valid parameters', (assert, done) => {
    request.post('/v1/secrets/share')
      .send(params)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response, 'Returns a valid response')
        done()
      })
  })
})
