'use strict'

const db = require('localforage')

let network = {}
let networkList = document.querySelector('#network')
let networkAdd = document.querySelector('#network-add')
let notification = document.querySelector('#notify')

function notify(msg) {
  notification.classList.remove('error')

  if (msg.error) {
    notification.classList.add('error')
    notification.textContent = msg.error
  } else {
    notification.textContent = msg.notice
  }
}

function redraw() {
  networkList.innerHTML = ''
  for (var k in network) {
    let n = document.createElement('li')
    n.textContent = k
    n.id = 'network-' + k.replace(/^\w+/gi, '')
    networkList.appendChild(n)
  }
}

exports.add = function (host) {
  let msg = {}

  if (!host.match(/^http/)) {
    msg.error = 'Invalid URL for host'
    notify(msg)
    return
  }

  db.getItem('network', (err, n) => {
    if (!err && n) {
      network = n
    } else {
      network = {}
    }

    host = host.replace(/\/$/, '')
    network[host] = new Date().getTime()

    db.setItem('network', network, (err) => {
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

exports.remove = function (host) {
  delete network[host]

  let msg = {}

  db.setItem(host, (err) => {
    if (err) {
      msg.error = err
    } else {
      msg.notice = host
    }

    redraw()
  })
}

exports.list = function () {
  db.getItem('network', (err, n) => {
    if (!err && n) {
      network = n
    }

    redraw()
  })
}
