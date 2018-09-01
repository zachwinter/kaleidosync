import Visualizer from './visualizer'

class Template extends Visualizer {
  constructor() {
    super()

    this.setEventHooks()
    this.initializeVisualizer()
  }

  setEventHooks() {
    // Called before and after visualizer starts for the first tiem.
    this.events.beforeInit  = () => console.log('beforeInit()')
    this.events.afterInit   = () => console.log('afterInit()')   

    // Called before and after visualizer starts.
    this.events.beforeStart = () => console.log('beforeStart()') 
    this.events.afterStart  = () => console.log('afterStart()')

    // Called before and after the visualizer stops.
    this.events.beforeStop  = () => console.log('beforeStop()')
    this.events.afterStop   = () => console.log('afterStop()')
  }
  
  // Automatically called during the `beforeStart` event.
  setIntervalHooks() {
    this.intervals.hooks.tatums = (i) => {
      console.log('Tatum: ' + i)
    }

    this.intervals.hooks.segments = (i) => {
      console.log('Segment: ' + i)
    }

    this.intervals.hooks.beats = (i) => {      
      console.log('Beat: ' + i)
    }

    this.intervals.hooks.bars = (i) => {
      console.log('Bar: ' + i)
    }

    this.intervals.hooks.sections = (i) => {
      console.log('Section: ' + i)
    }
  } 
}

export default Template