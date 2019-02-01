# Dark Crystal Secrets HTTP API

Dark Crystal Secrets API is a HTTP JSON API which opens up [dark-crystal-secrets](https://github.com/blockades/dark-crystal-secrets), our wrapper around Shamir's Secret Shares.

Dark Crystal transforms secrets into crystal shards that you can send to trusted friends. If you lose the secret, or something happens to you, your friends can combine the shards to recover the crystal and reveal the secret.

Dark Crystal's Secrets API has no database, it does not store any secrets or shards. It is purely a computational API.

**This is recommended as a local resource / background process for integrating Dark Crystal's cryptography into your application.**

## Build the Application

_With Docker_:

```
docker-compose up
```

_Without Docker_:

```
npm install
npm start
```


## Swagger

Swagger Documentaation can be found at `http://localhost:8990/`

## API

#### POST `/v1/secrets/share`

**Splits a secret into shards**

_Parameters_:
```json
{
  "secret": "super duper secret",
  "quorum": 3,
  "shards": 5
}
```

_Response_:
```json
{
  "shards": [
    "801DtNqkT8HwxneNCFKTiupa9T3zJrqCgt8QONyHI1becBoQcK8aZ6XwopZYZBU6rFuDpc16rLGi4HUhuqxj3uEmOa8On4NHR2sKI7Gw/NWbIQ=",
    "802DmRTNg2Bkeev1DE+JOn1ZtHiRJQ1GLMEnZ9rvQq+riLlsepnYHJThJIlV/Pi3xyhdbwV5hQCOABgYDiC9OaNoJ1MtY0q0wbGpDfNvWUd76M=",
    "803ALc5pzKGUv5x4W7LmiBHoP1adfeQXDQbV80Z/IeJ146NhSi1CcDEZBgINga2R62se04gf6bks/O0g9JDe+gJXHvQj4EnqxsajMwLDZZpg3w=",
    "804VJOASMsZF6B7cANlq968U3Mv2bUPvULU5v/QFSAfLNwDahiGMgw7gm/6wM3sD6m9U0rLloGPvIizMJMgDkhddQrBVCqUEfxNom/qBIgnH8c=",
    "805WkDq2fQe1LmlRVyQFRcOlV+X6Naq+cXLLK2iVK0oVXBrXtpUW76sYuXXoTi4lxiwXbj+DzNpN3tn03nhgUbZiexdbiaZaeGRipQstHtTcxg="
  ]
}
```

_Errors_:
* `secret` must be a string
* `quorum` must be an integer
* `quorum` must be greater than 1
* `shards` must be an integer
* `shards` must be greater than or equal to provided `quorum`

#### POST `/v1/secrets/combine`

**Recombine shards to form the original secret**

_Parameters_:
```json
{
  "shards": [
    "801/SxOWX7NyQsWhS/cLKvvHZqfpTCndK0drtd0B1Sle6yWScnFSChH+6yxzGHVnNJD",
    "802LVP15h5CWfVkZpu3mlkchA4IRpYucw8VE/RTM4A8nFt4PBICwnvFpE6+8LgbCqO6",
    "8030H6aoGg/l6CQjSD9yZpHPWNt4/uJa6JkvVYnWtS159XuAduiiiGCPOJqPKrOtHGi"
  ],
  "version": "2.0.0"
}
```

_Response_:
```json
{
  "secret": "super duper secret"
}
```

_Errors_:
* `version` must be a semantic version
* `version` not currently supported
* `shards` must be an array
* one or more of the provided shards are not valid

#### POST `/v1/secrets/verify`

**Check to see if the shards you hold will produce a valid secret**

_Parameters_:
```json
{
  "shards": [
    "801/SxOWX7NyQsWhS/cLKvvHZqfpTCndK0drtd0B1Sle6yWScnFSChH+6yxzGHVnNJD",
    "802LVP15h5CWfVkZpu3mlkchA4IRpYucw8VE/RTM4A8nFt4PBICwnvFpE6+8LgbCqO6",
    "8030H6aoGg/l6CQjSD9yZpHPWNt4/uJa6JkvVYnWtS159XuAduiiiGCPOJqPKrOtHGi"
  ],
  "version": "2.0.0"
}
```

_Response_:
```json
{
  "valid": true
}
```

_Errors_:
* `version` must be a semantic version
* `version` not currently supported
* `shards` must be an array
* one or more of the provided shards are not valid

#### POST `/v1/shards/verify`

**Check to see if s shard is a valid dark-crystal-secrets shard**

_Parameters_:
```json
{
  "shard": "801/SxOWX7NyQsWhS/cLKvvHZqfpTCndK0drtd0B1Sle6yWScnFSChH+6yxzGHVnNJD"
}
```

_Response_:
```json
{
  "valid": true
}
```

_Errors_:
* `version` must be a semantic version
* `version` not currently supported
* `shard` must be a string
* invalid shard format
