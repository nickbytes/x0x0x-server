'use strict'

exports.add = function (inputs, ws) {
  let data = {}

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === 'checkbox') {
      if (inputs[i].checked) {
        inputs[i].value = true
      } else {
        inputs[i].value = false
      }
    }

    data[inputs[i].name] = inputs[i].value
  }

  ws.send(JSON.stringify({
    type: 'item.add',
    value: data
  }))
}
