const _ = require('lodash')

const QueriesModel = require('../models/queries_model')
const server = require('../../../lib/server')
const definitions = require('../models/defined_queries.json5')
const supersequel = require('@elseblock/supersequel')({
  helpers: [{ functions: _, prefix: '_', context: false }],
  definitions: definitions,
  query: query => QueriesModel.query(query),
  release: () => QueriesModel.release(),
  debug: true
})

/**
 * query
 */
server.post('/query', supersequel.middleware())
