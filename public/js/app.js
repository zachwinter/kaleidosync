import Index from './pages/index'
import Kaleidoscope from './kaleidosync/kaleidoscope'

class App {
  constructor() {
    const bodyClass = document.body.classList

    if (bodyClass.contains('index')) {
      this.index = new Index
    }

    if (bodyClass.contains('visualizer')) {
      window.KALEIDOSYNC = new Kaleidoscope(false)
      window.KALEIDOSYNC.duration = 100
      window.KALEIDOSYNC.buildSingleState(true)
      document.body.classList.add('loaded')
    }
  }
}

export default new App