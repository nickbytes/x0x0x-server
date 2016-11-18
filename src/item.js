'use strict'

const dbs = require('./db')
const db = dbs.register('items', { ttl: true })
const request = require('client-request')
const cheerio = require('cheerio')
const WebSocket = require('ws')
const concat = require('concat-stream')

exports.add = function (item) {
  function getReq (link) {
    let title = ''
    let opts = {
      uri: item.value.url,
      method: 'GET',
      timeout: 1000
    }

    if (!opts.uri.match(/^http(s?):\/\/\w+/i)) {
      console.log('Invalid url')
      return
    }

    request(opts, (err, resp, body) => {
      if (!err) {
        let $ = cheerio.load(body.toString())
        title = $('title').text()
      } else {
        console.log('Error ', err)
        return
      }

      let linkArr = link.split('://')
      let ws = new WebSocket('ws' + (linkArr[0] === 'https' ? 's' : '') + '://' + linkArr[1])
      let created = new Date().getTime()

      db.put('link~' + created + '~' + link, {
        title: title || link,
        description: item.value.description,
        url: item.value.url,
        created: created
      }, { ttl: 30000 }, (err) => {
        if (err) {
          console.log('Could not save link: ', err)
        }
      })

      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'item.feed',
          title: title,
          value: [item.value]
        }))
      })
    })
  }

  if (Object.keys(item.hosts).length < 1) {
    console.log('No hosts provided')
  } else {
    for (let k in item.hosts) {
      getReq(k)
    }
  }
}

exports.list = function (ws) {
  let rs = db.createValueStream({
    gte: 'link~',
    lte: 'link~\xff',
    reverse: true,
    limit: 50
  })

  rs.pipe(concat((items) => {
    let opts = {
      type: 'item.feed',
      value: items
    }

    ws.send(JSON.stringify(opts))
  }))

  rs.on('error', (err) => {
    console.log('Link retrieval error ', err)
  })
}
