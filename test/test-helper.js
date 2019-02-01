const app = require('../app')
const PORT = 8123

module.exports = {
  app: () => app.listen(PORT)
}
