class Toast {
  constructor() {
    this.duration = 6000 
    this.el = document.createElement('div')
    this.el.id = 'toast'
    document.body.appendChild(this.el)
    this.visible = false

    this.typedOptions = {
      showCursor: false,
      typeSpeed: 40,
      onComplete: () => setTimeout(() => {
        this.hide()
        this.visible = false
      }, this.duration)
    }
  }

  notPlaying() {
    if (this.visible === false) {
      this.el.innerHTML = `
        <h1><i id="typed"></i></h1>
      `

      this.show()

      this.typed = new Typed('#typed', {
        ...this.typedOptions,
        strings: ['No song detected! Play a song in Spotify to get started.'],
        onComplete: () => {}
      })

      this.visible = true
    }
  }

  syncing() {
    this.el.innerHTML = `
      <h1><i id="typed"></i></h1>
    `

    this.show()

    this.typed = new Typed('#typed', {
      ...this.typedOptions,
      strings: ['Syncing . . .'],
      typeSpeed: 200
    })
  }
 
  nowPlaying(track) {
    this.el.innerHTML = `
      <img src="${track.artwork}" />
      <h1><i id="typed"></i> <span>${track.artist}</span></h1>
    `

    this.show()

    this.typed = new Typed('#typed', {
      ...this.typedOptions,
      strings: [track.title]
    })
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