const port = process.env.PORT || 8990
const app = require('./app')

app.listen(port)

console.log('Dark Crystal Secrets API is listening on', port)
