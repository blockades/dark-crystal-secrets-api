const app = require('../app')
const PORT = 8990

module.exports = {
  app: () => app.listen(PORT)
}
