'use strict'

var notify = require('./notify')
var network = require('./network')

var feed = document.querySelector('#feed')

exports.add = function (inputs, ws) {
  var data = {}
  var msg = {}

  for (var i = 0; i < inputs.length; i++) {
    var update = false
    switch (inputs[i].name) {
      case 'ttl':
        if (inputs[i].checked) {
          inputs[i].value = true
        } else {
          inputs[i].value = false
        }
        update = true
        break
      case 'url':
        if (inputs[i].value.match(/^http/)) {
          inputs[i].value = inputs[i].value.replace(/\/$/, '')
          update = true
        } else {
          msg.error = 'Cannot add `' + inputs[i].value + '`\n' +
                      'Invalid URL format'
          notify(msg)
        }
        break
      default:
        update = true
        break
    }

    if (update) {
      data[inputs[i].name] = inputs[i].value
      inputs[i].value = ''
      inputs[i].checked = ''
    } else {
      return
    }
  }

  network.list(true, function (_, hosts) {
    ws.send(JSON.stringify({
      type: 'item.add',
      value: data,
      hosts: hosts
    }))
  })
}

exports.display = function (result) {
  switch (result.type) {
    case 'item.add':
      console.log('item added ', result)
      break
    case 'item.feed':
      result = result.value
      result.forEach((r) => {
        var li = document.createElement('li')
        var h3 = document.createElement('h3')
        h3.textContent = r.title || r.url
        var p = document.createElement('p')
        p.classList.add('description')
        p.textContent = r.description
        var a = document.createElement('a')
        a.href = a.textContent = r.url
        li.appendChild(h3)
        li.appendChild(p)
        li.appendChild(a)
        feed.appendChild(li)
      })
      break
    default:
      break
  }
}
