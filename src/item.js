'use strict'

const dbs = require('./db')
const db = dbs.register('items')

exports.add = function (item, ws) {
  console.log(item)
}