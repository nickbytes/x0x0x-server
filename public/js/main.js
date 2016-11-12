'use strict'

const item = require('./item')
const network = require('./network')

const protocol = window.document.location.protocol
const port = window.document.location.port ? ':' + window.document.location.port : ''
const host = window.document.location.host.replace(/:.*/, '')

const ws = new window.WebSocket('ws' + (protocol === 'https' ? 's' : '') + '://' + host + port)
const formItem = document.querySelector('#form-item')
const formNetwork = document.querySelector('#form-network')

network.list()

formItem.onsubmit = function (ev) {
  ev.preventDefault()

  let inputs = this.querySelectorAll('input')
  item.add(inputs, ws)
}

formNetwork.onsubmit = function (ev) {
  ev.preventDefault()

  network.add(formNetwork.querySelector('input').value)
}
