'use strict'

const dbs = require('./db')
const db = dbs.register('items', { ttl: true })
const concat = require('concat-stream')

const ttlms = 60000 * 60 * 48 // 48 hours

exports.add = function (item, callback) {
  console.log('adding ', item)
  let link = item.value.url.split('://')[1].trim()

  let created = new Date().getTime()

  let obj = {
    description: item.value.description,
    url: item.value.url,
    created: created
  }

  if (!obj.url || !obj.url.match(/^http(s?):\/\/\w+/i)) {
    console.log('Invalid url')
    return callback(new Error('Invalid url'))
  }

  // currently 8 min
  db.put('link~' + link, obj, { ttl: ttlms }, (err) => {
    if (err) {
      console.log('Could not save link: ', err)
      return callback(err)
    }

    callback(null, JSON.stringify({
      type: 'item.feed',
      value: [item.value]
    }))
  })
}

exports.list = function (callback) {
  let rs = db.createValueStream({
    gte: 'link~',
    lte: 'link~\xff',
    reverse: true,
    limit: 80
  })

  rs.pipe(concat((items) => {
    let opts = {
      type: 'item.feed',
      value: items
    }
    callback(null, opts)
  }))

  rs.on('error', (err) => {
    callback(err)
    console.log('Link retrieval error ', err)
  })
}
