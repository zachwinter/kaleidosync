import Kaleidoscope from '../kaleidosync/kaleidoscope'

class Index {
  constructor() {
    window.KALEIDOSYNC = new Kaleidoscope(true, true)

    this.demoActive = false
    
    this.shade = document.getElementById('shade')
    this.buttons = document.querySelector('.buttons')
    this.login = this.buttons.querySelector('.login')
    this.demo = this.buttons.querySelector('.demo')

    document.body.classList.add('loaded')

    this.shade.addEventListener('transitionend', this.onLoaded.bind(this))
    this.login.addEventListener('click', this.getAuthId)
    this.demo.addEventListener('click', this.toggleDemo);
  }

  onLoaded() { 
    this.buttons.classList.add('show')
    this.shade.classList.add('hide')
    this.shade.removeEventListener('transitionend', this.onLoaded)
  }

  getAuthId() {
    fetch('/auth')
      .then((res) => res.json())
      .then((res) => {
        if (res.auth_id) {
          window.location.href = `/login?auth_id=${res.auth_id}`
        }
      })
  }

  toggleDemo() {
    if (!this.demoActive) {
      window.KALEIDOSYNC.interval = false
      window.KALEIDOSYNC.setEventHooks()
      window.KALEIDOSYNC.initializeVisualizer()
      window.KALEIDOSYNC.canvas.startPaint()
      this.demoActive = true
    } else {
      window.KALEIDOSYNC.interval = true
      window.KALEIDOSYNC.audio.pause()
      window.KALEIDOSYNC.stopVisualizer()
      window.KALEIDOSYNC.canvas.stopPaint()
      this.demoActive = false
    }
  }
}

export default Index