'use strict'

const db = require('./db')()

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

  db.set(link, obj, (err) => {
    if (err) {
      console.log('Could not save link: ', err)
      return callback(err)
    }

    callback(null, JSON.stringify({
      type: 'item.feed',
      value: [obj]
    }))
  })
}

exports.list = function (callback) {
  var results = {}
  db.keys((err, keys) => {
    if (err) {
      console.log('Link retrieval error ', err)
      return callback(err)
    }

    results.type = 'item.feed'
    results.value = []

    keys.forEach((k) => {
      db.get(k, (err, r) => {
        if (!err) {
          results.value.push({
            url: r.url,
            description: r.description,
            created: r.created
          })
        }
      })
    })

    callback(null, results)
  })
}
