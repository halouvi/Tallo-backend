module.exports = {
  makeId(length = 5) {
    var txt = ''
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
  },
  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  capitalize(string = '') {
    return string
      .toLowerCase()
      .split(/,|-| /)
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  },
  blurAll() {
    if ('activeElement' in document) document.activeElement.blur()
  },
}
