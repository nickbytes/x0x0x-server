'use strict'

var db = require('localforage')

var notify = require('./notify')
var network = require('./network')

var feed = document.querySelector('#feed')
var saved = document.querySelector('#saved')
var savedItems = {}

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

exports.list = function () {
  var msg = {}
  db.getItem('saved', function (err, items) {
    if (err) {
      msg.error = 'Could not retrieve saved links'
      notify(msg)
    } else {
      console.log('loaded: ', items)
      for (var k in items) {
        savedItems[k] = items[k]
        var li = generateLink(items[k])
        if (saved.childNodes.length < 1) {
          saved.append(li)
        } else {
          saved.prepend(li)
        }
      }
    }
  })
}

function generateLink (item) {
  var li = document.createElement('li')
  var h3 = document.createElement('h3')
  h3.textContent = item.title
  var p = document.createElement('p')
  p.classList.add('description')
  p.textContent = item.description
  var a = document.createElement('a')
  a.href = a.textContent = item.url
  li.appendChild(h3)
  li.appendChild(p)
  li.appendChild(a)
  return li
}

exports.display = function (result) {
  var msg = {}

  switch (result.type) {
    case 'item.add':
      console.log('item added ', result)
      break
    case 'item.feed':
      result = result.value
      result.forEach((r) => {
        var item = {
          id: r.url.replace(/[^A-Z0-9]+/gi, ''),
          title: r.title || r.url,
          url: r.url,
          description: r.description
        }

        var li = generateLink(item)
        var btn = document.createElement('button')
        btn.textContent = '↯'
        btn.onclick = function () {
          if (!savedItems[item.id]) {
            savedItems[item.id] = item
            db.setItem('saved', savedItems, function (err) {
              if (err) {
                msg.error = 'Could not save link'
                notify(msg)
              } else {
                btn.classList.add('saved')
                var li2 = generateLink(item)
                if (saved.childNodes.length < 1) {
                  saved.append(li2)
                } else {
                  saved.prepend(li2)
                }
              }
            })
          } else {
            msg.error = 'You have saved this link already.'
            notify(msg)
          }
        }

        li.appendChild(btn)
        if (feed.childNodes.length < 1) {
          feed.append(li)
        } else {
          feed.prepend(li)
        }
      })
      break
    default:
      break
  }
}
