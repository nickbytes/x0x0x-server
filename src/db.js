'use strict'

const level = require('level')
const ttl = require('level-ttl')

// Load this up once at startup.  Changing DB locations
// mid-process is not supported.
const path = './db'

let dbs = {}
let options = {}

exports = module.exports = function (key) {
  if (!dbs[key]) {
    throw new Error('Database not registered: ' + key)
  }
  return dbs[key]
}

exports.register = function (key, opt) {
  if (dbs[key]) {
    throw new Error('Database already registered: ' + key)
  }

  const dbPath = path + '/' + key
  let db = level(dbPath, {
    createIfMissing: true,
    valueEncoding: 'json'
  })

  if (opt && opt.ttl) {
    db = ttl(db)
  }

  dbs[key] = db
  options[key] = opt

  return db
}
