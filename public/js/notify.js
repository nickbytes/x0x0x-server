'use strict'

var notification = document.querySelector('#notify')

module.exports = function (msg) {
  notification.classList.remove('error')

  if (msg.error) {
    notification.classList.add('error')
    notification.textContent = msg.error
  } else if (msg.notice) {
    notification.textContent = msg.notice
  } else {
    notification.textContent = ''
  }
}
