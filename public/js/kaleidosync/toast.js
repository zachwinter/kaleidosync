class Toast {
  constructor() {
    this.duration = 5000
    this.el = document.createElement('div')
    this.el.id = 'toast'
    document.body.appendChild(this.el)
  }

  notPlaying() {
    this.el.innerHTML = `
      <h1><i>No song currently playing.</i></h1>
    `

    this.show()
  }

  nowPlaying(track) {
    this.el.innerHTML = `
      <img src="${track.artwork}" />
      <h1>${track.title} <span>${track.artist}</span></h1>
    `

    this.show()

    setTimeout(() => {
      this.hide()
    }, this.duration)
  }
 
  show() {
    setTimeout(() => {
      this.el.style.opacity = 1
    }, 20)
  }

  hide() {
    setTimeout(() => {
      this.el.style.opacity = 0
    }, 20)
  }
}

export default Toast