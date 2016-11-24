'use strict'

const dbs = require('./db')
const db = dbs.register('items', { ttl: true })
const concat = require('concat-stream')

const ttlms = 60000 * 60 * 48 // 48 hours

exports.add = function (item, callback) {
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

  db.get('link~' + link, (err, lk) => {
    if (err || !lk) {
      let opts = [
        {
          type: 'put',
          key: 'link~' + link,
          value: obj
        },
        {
          type: 'put',
          key: 'feed~' + created + '~' + link,
          value: obj
        }
      ]

      db.batch(opts, { ttl: ttlms }, (err) => {
        if (err) {
          console.log('Could not save link: ', err)
          return callback(err)
        }
        callback(null, JSON.stringify({
          type: 'item.feed',
          value: [item.value]
        }))
      })
    } else {
      callback(null, JSON.stringify({
        type: 'item.feed',
        value: [lk]
      }))
    }
  })
}

exports.list = function (callback) {
  let rs = db.createValueStream({
    gte: 'feed~',
    lte: 'feed~\xff',
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
