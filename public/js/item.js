'use strict'

var notify = require('./notify')
var network = require('./network')

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
