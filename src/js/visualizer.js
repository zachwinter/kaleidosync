import SpotifyAnalyzer from 'spotify-analyzer';
import Konva from 'lib/konva';

/**
 * Class representing a canvas music visualizer based on currently playing Spotify track.
 * @extends SpotifyNowPlaying
 *
 * @prop {boolean} active        - The visualizer's play state.
 * @prop {boolean} initialized   - Whether or not the visualizer has undergone initial setup. 
 * @prop {object}  containerSize - Width and height of container <canvas> element.
 * @prop {object}  events        - Visualizer events namespace.
 * @prop {object}  canvas        - Instance of Konva.Layer(); the visualizer's home. 
 */
class Visualizer extends SpotifyAnalyzer {
  /** 
   * Create a visualizer. 
   * @param {string} container - ID of our parent canvas element.
   */
  constructor(container) {
    super();

    this.active = false;
    this.initialized = false;
    this.containerElement = document.getElementById(container);
    this.containerSize = {
      width  : window.innerWidth,
      height : window.innerHeight
    };
    this.events = {
      beforeInit: () => {},
      afterInit: () => {},
      beforeStart: () => {},
      afterStart: () => {},
      beforeStop: () => {},
      afterStop: () => {}
    };
    this.canvas = new Konva.Layer();

    let stage = new Konva.Stage({
      container: container,
      width: this.containerSize.width,
      height: this.containerSize.height
    });

    stage.add(this.canvas);
  }

  /** Start visualizer. */
  start() {        
    if (this.initialized === false) {
      this.events.afterInit.bind(this).call();
      this.initialized = true;
    }

    this.events.beforeStart.bind(this).call();
    this.initializeHooks();
    this.active = true;
    this.events.afterStart.bind(this).call();
  }

  /** Stop visualizer. */
  stop() { 
    this.events.beforeStop.bind(this).call();
    this.removeHooks();
    this.active = false;
    this.events.afterStop.bind(this).call();
  }

  /** Initialize visualizer. */
  init() {
    this.events.beforeInit.bind(this).call();

    this.getCurrentTrack((response, delay) => {
      this.setState(response, delay)
    });

    setInterval(() => {
      this.getCurrentTrack((response, delay) => {
        this.setState(response, delay)
      });
    }, 5000);
  }

  /** 
   * Determine and set visualizer state.
   * @param {object} response - Server response containing currently playing track.
   * @param {number} delay    - Time elapsed between request and response.
   */
  setState(response, delay) {
    console.log(response);

    if (this.active) {
      /** Stop visualizer if no track is currently playing. */
      if (!response.is_playing) 
        return this.stop();

      /** Restart visualizer if cached current track doesn't match response. */
      if (JSON.stringify(this.currentTrack.item) !== JSON.stringify(response.item)) {
        this.stop();

        this.currentTrack = response;

        this.getTrackData(() => {
          this.trackProgress = { 
            progress: response.progress_ms + delay,
            timestamp: window.performance.now()
          };

          this.start();
        })

        return;
      }
    }

    /** Start visualizer when response indicates currently playing track. */
    if (!this.active && response.is_playing) {     
      this.currentTrack = response;

      this.getTrackData(() => {
        this.trackProgress = { 
          progress: response.progress_ms + delay,
          timestamp: window.performance.now()
        }; 

        this.start();
      });
    } 
  }
}

export default Visualizer;  