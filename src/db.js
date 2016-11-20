'use strict'

const NodeCache = require('node-cache')
const db = new NodeCache({ stdTTL: 60 * 60 * 24 })

module.exports = function () {
  return db
}
