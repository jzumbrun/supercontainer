require('module-alias/register')
require('json5/lib/register')
const seeder = require('./seeder')

// Run the test seeds from command line
seeder.seed('greeting').then(() => {
  process.exit()
})
