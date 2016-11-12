'use strict'

const WebSocketServer = require('ws').Server
const http = require('http')
const path = require('path')
const express = require('express')
let app = express()

app.use(express.static(path.join(__dirname, '/public')))

const server = http.createServer(app)
server.listen(8080)

const wss = new WebSocketServer({
  server: server
})

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    data = JSON.parse(data)

    switch (data.type) {
      case 'item.add':
        console.log('got here ', data.value)
        break
      case 'item.save':

        break
      default:
        break
    }
  })
})
