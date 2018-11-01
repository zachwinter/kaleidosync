class Toast {
  constructor() {
    this.createElement()
    this.duration = 2500 
    this.visible = false
    this.typedOptions = {
      showCursor: false,
      typeSpeed: 30,
      onComplete: () => setTimeout(() => {
        this.hide()
        this.visible = false
      }, this.duration)
    }
  }

  createElement() {
    this.el = document.createElement('div')
    this.el.id = 'toast'
    document.body.appendChild(this.el)
  }

  notPlaying() {
    if (this.visible === false) {
      this.el.innerHTML = `<h1><i id="typed"></i></h1>`

      this.show()

      this.typed = new Typed('#typed', {
        ...this.typedOptions,
        strings: ['No playback detected'],
        onComplete: () => {}
      })

      this.visible = true
    }
  }

  syncing() {
    this.el.innerHTML = `<h1><i id="typed"></i></h1>`

    this.show()

    this.typed = new Typed('#typed', {
      ...this.typedOptions,
      strings: ['Syncing']
    })
  }
 
  nowPlaying(track) {
    this.el.innerHTML = `<img src="${track.artwork}" /><h1><i id="typed"></i> <span>${track.artist}</span></h1>`

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