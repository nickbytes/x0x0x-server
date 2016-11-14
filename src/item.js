'use strict'

const dbs = require('./db')
const db = dbs.register('items')
const request = require('client-request')
const cheerio = require('cheerio')
const WebSocket = require('ws')

exports.add = function (item) {
  function getReq (link) {
    let title = ''
    let opts = {
      uri: item.value.url,
      method: 'GET',
      timeout: 1000
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

      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'item.feed',
          title: title,
          value: item.value
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
