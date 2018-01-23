import SpotifyAnalyzer from 'spotify-analyzer';
import Toast from 'classes/toast';

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
  constructor(demo) {
    super(demo);
    
    this.audio = document.querySelector('audio');
    this.active = false;
    this.initialized = false;
    this.toast = new Toast;
    this.events = {
      beforeInit: () => {},
      afterInit: () => {},
      beforeStart: () => {},
      afterStart: () => {},
      beforeStop: () => {},
      afterStop: () => {}
    };
  }

  /** Start visualizer. */
  start(response) {  
    this.toast.nowPlaying({
      title: response.item.name,
      album: response.item.album.name,
      artist: response.item.artists[0].name,
      artwork: response.item.album.images[0].url
    });

    if (this.initialized === false) {
      this.events.afterInit.bind(this).call();
      this.initialized = true;
    }

    this.canvas.init();
    this.events.beforeStart.bind(this).call();
    this.initializeHooks();
    this.active = true;
    this.events.afterStart.bind(this).call();
  }

  /** Start demo. */
  startDemo(response) {
    this.audio.src = `/static/songs/${this.activeDemo}.mp3`;
    this.audio.play();
    
    let interval = setInterval(() => {
      let progress = this.audio.currentTime * 1000;
 
      if (progress >= 150) {
        this.trackProgress = { 
          progress: progress,
          timestamp: window.performance.now()
        };
        this.start(response);
        clearInterval(interval);
      }
    }, 20);
  }

  /** Stop visualizer. */
  stop() { 
    this.events.beforeStop.bind(this).call();
    this.removeHooks();
    this.active = false;
    this.events.afterStop.bind(this).call();

    setTimeout(() => {
      this.canvas.stopPaint();
    }, 5000);
  }

  /** Initialize visualizer. */
  init() {
    this.events.beforeInit.bind(this).call();

    this.getCurrentTrack((response, delay) => {
      this.setState(response, delay)
    });

    if (this.demo !== true) {
      setInterval(() => {
        this.getCurrentTrack((response, delay) => {
          this.setState(response, delay)
        });
      }, 5000);
    }
  }

  /** 
   * Determine and set visualizer state.
   * @param {object} response - Server response containing currently playing track.
   * @param {number} delay    - Time elapsed between request and response.
   */
  setState(response, delay) {
    if (response === 'Blank response.') {
      this.stop();
      this.toast.notPlaying();
      return;
    }

    if (this.active) {
      /** Stop visualizer if no track is currently playing. */
      if (!response.is_playing) {
        this.stop();
        this.toast.notPlaying();
        return;
      }

      /** Restart visualizer if cached current track doesn't match response. */
      if (JSON.stringify(this.currentTrack.item) !== JSON.stringify(response.item)) {
        this.stop();

        this.currentTrack = response;

        this.getTrackData(() => {
          this.trackProgress = { 
            progress: response.progress_ms + delay,
            timestamp: window.performance.now()
          };

          if (this.demo === true) {
            this.startDemo(response);
          } else {
            this.start(response);
          }
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

        if (this.demo === true) {
          this.startDemo(response);
        } else {
          this.start(response);
        }
      });
    } 
  }
}

export default Visualizer;  