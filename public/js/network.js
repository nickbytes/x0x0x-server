'use strict'

var db = require('localforage')

var notify = require('./notify')

var network = {}
var networkList = document.querySelector('#network')
var networkAdd = document.querySelector('#network-add')

function remove(host) {
  delete network[host]

  var msg = {}

  db.setItem('network', network, function (err) {
    if (err) {
      msg.error = err
    } else {
      msg.notice = host
      redraw()
    }
    notify(msg)
  })
}

function redraw() {
  networkList.innerHTML = ''
  for (var k in network) {
    var n = document.createElement('li')
    n.textContent = k
    n.id = 'network-' + k.replace(/^\w+/gi, '')
    var btn = document.createElement('button')
    btn.textContent = 'x'
    btn.onclick = function (ev) {
      ev.preventDefault()
      remove(k)
    }
    n.appendChild(btn)
    networkList.appendChild(n)
  }
}

exports.add = function (host) {
  var msg = {}

  if (!host.match(/^http/)) {
    msg.error = 'Invalid URL for host'
    notify(msg)
    return
  }

  db.getItem('network', function (err, n) {
    if (!err && n) {
      network = n
    } else {
      network = {}
    }

    host = host.replace(/\/$/, '')
    network[host] = new Date().getTime()

    db.setItem('network', network, function (err) {
      if (err) {
        msg.error = 'Could not save host: ' + err
      } else {
        msg.notice = 'Added host ' + host
        redraw()
      }
      notify(msg)
    })
  })
}

exports.list = function (shallow, next) {
  db.getItem('network', function (err, n) {
    if (!err && n) {
      network = n
    }

    if (shallow && next) {
      next(null, network)
    } else {
      redraw()
    }
  })
}
