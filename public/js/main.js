'use strict'

var item = require('./item')
var network = require('./network')

var protocol = window.document.location.protocol
var port = window.document.location.port ? ':' + window.document.location.port : ''
var host = window.document.location.host.replace(/:.*/, '')

var formItem = document.querySelector('#form-item')
var formNetwork = document.querySelector('#form-network')
var reconnectInterval = 1000 * 60

var ws

var connect = function () {
  ws = new window.WebSocket('ws' + (protocol === 'https' ? 's' : '') + '://' + host + port)
  ws.onerror = ws.onclose = function () {
    window.setTimeout(connect, reconnectInterval)
  }
  ws.onmessage = function (data) {
    item.display(JSON.parse(data.data))
  }
}

network.list()

formItem.onsubmit = function (ev) {
  ev.preventDefault()

  var inputs = this.querySelectorAll('input')
  item.add(inputs, ws)
}

formNetwork.onsubmit = function (ev) {
  ev.preventDefault()

  network.add(formNetwork.querySelector('input').value)
}

connect()
