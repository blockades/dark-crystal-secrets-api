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
      secret: 'thisismysecret',
      quorum: 3,
      shards: 5
    }
  })

  context.afterEach((c) => {
    server.close()
  })

  context('valid with correct parameters', (assert, done) => {
    request.post('/v1/secrets/share')
      .send(params)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.ok(Array.isArray(response.body.shards))
        assert.equal(response.body.shards.length, 5)
        done()
      })
  })

  context('invalid when secret is undefined', (assert, done) => {
    delete params.secret

    request.post('/v1/secrets/share')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'secret',
          msg: '\'secret\' must be a string'
        }])

        done()
      })
  })

  context('invalid when secret is not a string', (assert, done) => {
    params.secret = 1

    request.post('/v1/secrets/share')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'secret',
          value: params.secret,
          msg: '\'secret\' must be a string'
        }])

        done()
      })
  })

  context('invalid when quorum is undefined', (assert, done) => {
    delete params.quorum

    request.post('/v1/secrets/share')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'quorum',
          msg: '\'quorum\' must be an integer'
        }, {
          location: 'body',
          param: 'quorum',
          msg: '\'quorum\' must be greater than 1'
        }, {
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: "'shards' must be greater than or equal to provided 'quorum'"
        }])

        done()
      })
  })

  context('invalid when quorum is less than or equal to one', (assert, done) => {
    params.quorum = 1

    request.post('/v1/secrets/share')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'quorum',
          value: params.quorum,
          msg: '\'quorum\' must be greater than 1'
        }])

        done()
      })
  })

  context('invalid when quorum is a non-numerical string', (assert, done) => {
    params.quorum = 'one'

    request.post('/v1/secrets/share')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'quorum',
          value: params.quorum,
          msg: '\'quorum\' must be an integer'
        }, {
          location: 'body',
          param: 'quorum',
          value: params.quorum,
          msg: '\'quorum\' must be greater than 1'
        }, {
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: "'shards' must be greater than or equal to provided 'quorum'"
        }])

        done()
      })
  })

  context('invalid when shards is undefined', (assert, done) => {
    delete params.shards

    request.post('/v1/secrets/share')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'shards',
          msg: '\'shards\' must be an integer'
        }, {
          location: 'body',
          param: 'shards',
          msg: "'shards' must be greater than or equal to provided 'quorum'"
        }])

        done()
      })
  })

  context('invalid when shards is less than quorum', (assert, done) => {
    params.shards = 2

    request.post('/v1/secrets/share')
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
          msg: "'shards' must be greater than or equal to provided 'quorum'"
        }])

        done()
      })
  })

  context('invalid when shards is a non-numerical string', (assert, done) => {
    params.shards = 'two'

    request.post('/v1/secrets/share')
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
          msg: '\'shards\' must be an integer'
        }, {
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: "'shards' must be greater than or equal to provided 'quorum'"
        }])

        done()
      })
  })
})
