'use strict'

const WebSocketServer = require('ws').Server
const http = require('http')
const path = require('path')
const express = require('express')
let app = express()

const item = require('./src/item')

app.use(express.static(path.join(__dirname, '/public')))

const server = http.createServer(app)
server.listen(8080)

const wss = new WebSocketServer({
  server: server
})

function broadcast (data) {
  wss.clients.forEach(function each (client) {
    client.send(JSON.stringify(data))
  })
}

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    data = JSON.parse(data)

    switch (data.type) {
      case 'item.add':
        item.add(data)
        break
      case 'item.feed':
        broadcast(data)
        break
      case 'item.save':

        break
      default:
        break
    }
  })
})
