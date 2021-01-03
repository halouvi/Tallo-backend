module.exports = {
  execute(board) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) resolve(parseInt(Math.random() * 100))
        else reject('Err')
      }, 0)
    })
  },
}
