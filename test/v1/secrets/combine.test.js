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
      version: '1.0.0',
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

  context('invalid when version is not a semantic version', (assert, done) => {
    params.version = 'this is not a version'

    request.post('/v1/secrets/combine')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        // Sadly express-validation doesn't currently break the validation chain, so we have to check for cascading errors...
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'version',
          value: params.version,
          msg: '\'version\' must be semantic version'
        }, {
          location: 'body',
          param: 'version',
          value: params.version,
          msg: '\'version\' not currently supported'
        }, {
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: 'one or more of the provided shards are not valid'
        }])

        done()
      })
  })

  context('invalid when version is not a live version', (assert, done) => {
    params.version = '0.1.1'

    request.post('/v1/secrets/combine')
      .send(params)
      .expect(422)
      .expect('Content-Type', /json/)
      .end((err, response) => {
        assert.notOk(err, 'No error is raised')
        assert.ok(response.body)
        assert.deepEqual(response.body.errors, [{
          location: 'body',
          param: 'version',
          value: params.version,
          msg: '\'version\' not currently supported'
        }, {
          location: 'body',
          param: 'shards',
          value: params.shards,
          msg: 'one or more of the provided shards are not valid'
        }])

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

  context.group('version 1.0.0', (group) => {
    group('v1 valid with correct parameters', (assert, done) => {
      params.version = '1.0.0'

      request.post('/v1/secrets/combine')
        .send(params)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          assert.notOk(err, 'No error is raised')
          assert.ok(response.body)
          assert.equal(typeof response.body.secret, 'string')
          assert.deepEqual(response.body, { secret: 'secret' })
          done()
        })
    })

    group('v1 invalid when shards contains an invalid shard', (assert, done) => {
      params.shards = [
        '80104424cf070d06548da4dd40d47f4c156', // v1.0.0 shard
        '801vvsr5XtY96OBNjla1Hju5TxywbS+lDmxvQTa023dn7xvL5Ye0ze2CUjq3Tp4CnRaFlyCA9z3earBScS5Ni2a0A==', // v2.0.0 shard
        '802a274f51b2fead5dd92a240a5f5545e67'
      ]

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

  context.group('version 2.0.0', (group) => {
    group.beforeEach((c) => {
      params.version = '2.0.0'
    })

    group('v2 valid with correct parameters', (assert, done) => {
      params.shards = [
        '801XLehJbKO49OnSvCLUIK6zvQDMxdfglisZD/sIF2MxCEor6zhGuWw7ElmdBeGN+szAmJYi1pfhX4Ryu8qvl7sOg==',
        '8029OsnTtc/eAsdhxL2qYDyCB2qH+hpvFMLPaSnuD1xCTd0Dpin9cob5+XnMXrPJf6NvvcVREeUImVNRbc5qEa1dA==',
        '803qFyGa2Wxm9i6zeJ81JUslpmqCSYqIvNzRWJZbWCgzTRczTQj702raqztRU9JPhWcvOFNqh25p3hc6lhgFjpZFQ==',
        '8042JGzjDGGRuwfX78t3U2JGVfSCUEdf0zLPVQooFxzWER4a36H1PmzThYhIVrcwjVvs+mEgGVpkJ87tL4gTqCqlg==',
        '805hCYSqYMIpT+4FU+noFhXh9PSH49e4eyzRZLWdQGinEdQqNIDzn4Dw18rVW9a2d5+sf/cbj9EFYIqG1F58NxG9w=='
      ]

      request.post('/v1/secrets/combine')
        .send(params)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          assert.notOk(err, 'No error is raised')
          assert.ok(response.body)
          assert.deepEqual(response.body, { secret: 'secret', label: 'label' })
          done()
        })
    })

    // TODO: See issue: https://github.com/blockades/dark-crystal-secrets/issues/1
    //
    // group('v2 invalid when shards contains an v1 shard', (assert, done) => {
    //   params.shards = [
    //     '80104424cf070d06548da4dd40d47f4c156', // v1.0.0 shard
    //     '802w2XkhIDE1uggkMbNupfxc7iEYXIeGAH9OT8xA7wZBbmWl0ifMek4chhhAqCoK3NbSrI1oiI7NFOktJuBF0pH1Q==', // v2.0.0 shard
    //     '803fZ7PYfucIUuhpv+WQ3h7xvT1hR+8kMCYmML5JdGZmif51N7k4ryOGlDn37jQDQcjXJq3xP6+TZplmF9LIUXdXg=='
    //   ]

    //   request.post('/v1/secrets/combine')
    //     .send(params)
    //     .expect(422)
    //     .expect('Content-Type', /json/)
    //     .end((err, response) => {
    //       assert.notOk(err, 'No error is raised')
    //       assert.ok(response.body)
    //       assert.deepEqual(response.body.errors, [{
    //         location: 'body',
    //         param: 'shards',
    //         value: params.shards,
    //         msg: 'one or more of the provided shards are not valid'
    //       }])

    //       done()
    //     })
    // })

    group('v2 invalid when shards contains an invalid shard', (assert, done) => {
      params.shards = [
        'Shardy McShardface', // v1.0.0 shard
        '802w2XkhIDE1uggkMbNupfxc7iEYXIeGAH9OT8xA7wZBbmWl0ifMek4chhhAqCoK3NbSrI1oiI7NFOktJuBF0pH1Q==', // v2.0.0 shard
        '803fZ7PYfucIUuhpv+WQ3h7xvT1hR+8kMCYmML5JdGZmif51N7k4ryOGlDn37jQDQcjXJq3xP6+TZplmF9LIUXdXg=='
      ]

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
})
