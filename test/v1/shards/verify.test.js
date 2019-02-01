const { describe } = require('tape-plus')
const supertest = require('supertest')

const { app } = require('../../test-helper')

describe('POST /v1/shards/verify', (context) => {
  let server, request
  let params

  context.beforeEach((c) => {
    server = app()
    request = supertest.agent(server)

    params = {
      version: '1.0.0',
      shard: '80104424cf070d06548da4dd40d47f4c156'
    }
  })

  context.afterEach((c) => {
    server.close()
  })

  context('invalid when shard is not a string', (assert, done) => {
    params.shard = 1

    request.post('/v1/shards/verify')
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

  context.group('version 1.0.0', (group) => {
    group('v1 valid with correct parameters', (assert, done) => {
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

    group('v1 invalid when shard is incorrect version', (assert, done) => {
      params.shard = '801vvsr5XtY96OBNjla1Hju5TxywbS+lDmxvQTa023dn7xvL5Ye0ze2CUjq3Tp4CnRaFlyCA9z3earBScS5Ni2a0A=='

      request.post('/v1/shards/verify')
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

  context.group('version 2.0.0', (group) => {
    group.beforeEach((c) => {
      params.version = '2.0.0'
    })

    group('v2 valid with correct parameters', (assert, done) => {
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

    // TODO: See issue: https://github.com/blockades/dark-crystal-secrets/issues/1
    //
    // group('v2 invalid when shard is incorrect version', (assert, done) => {
    //   params.shard = '80104424cf070d06548da4dd40d47f4c156' // v1 shard

    //   request.post('/v1/shards/verify')
    //     .send(params)
    //     .expect(422)
    //     .expect('Content-Type', /json/)
    //     .end((err, response) => {
    //       assert.notOk(err, 'No error is raised')
    //       assert.ok(response.body)
    //       assert.deepEqual(response.body.errors, [{
    //         location: 'body',
    //         param: 'shard',
    //         value: params.shard,
    //         msg: 'invalid shard format'
    //       }])

    //       done()
    //     })
    // })
  })
})
