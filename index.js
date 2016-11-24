'use strict'

const WebSocketServer = require('ws').Server
const http = require('http')
const path = require('path')
const express = require('express')
const helmet = require('helmet')

const item = require('./src/item')

const app = express()
//app.use(helmet())
app.use(express.static(path.join(__dirname, '/public')))

const server = http.createServer(app)
server.listen(process.env.PORT || 8080)

const wss = new WebSocketServer({
  server: server
})

function broadcast (data, ws, sendToAll) {
  wss.clients.forEach(function each (client) {
    if (sendToAll) {
      client.send(JSON.stringify(data))
    } else if (client === ws) {
      client.send(JSON.stringify(data))
    }
  })
}

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    data = JSON.parse(data)

    switch (data.type) {
      case 'item.add':
        console.log('adding link ', data)
        item.add(data, (err, result) => {
          if (err) {
            console.log(err)
            return
          }
          broadcast(result, ws, true)
        })
        break
      case 'item.feed':
        item.list((err, list) => {
          if (err) {
            console.log(err)
            return
          }
          broadcast(list, ws)
        })
        break
      default:
        break
    }
  })
})
