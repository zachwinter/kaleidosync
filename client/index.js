import './polyfills'
import Kaleidosync from './kaleidosync'
import './style.scss'

export default new class App {
  constructor () {		
    if (window.location.hash === '#start') {
      this.kaleidosync = new Kaleidosync
    } else {
      this.auth()
    }
  }

  auth () {
    fetch('http://localhost:8001/auth')
      .then(res => res.json())
      .then(res => res.auth_id ? window.location.href = `http://localhost:8001/login?auth_id=${res.auth_id}` : null)
      .catch(err => console.log(err))
  }
}