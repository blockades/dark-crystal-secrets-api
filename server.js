const app = require('./app')

const port = process.env.PORT || 3000
const hostname = process.env.HOST || 'localhost'

var host
if (process.env.NODE_ENV === 'development') host = `localhost:${port}`
else host = `${hostname}:${port}`

app.listen(port)

console.log('Dark Crystal Secrets API is listening on', host)
