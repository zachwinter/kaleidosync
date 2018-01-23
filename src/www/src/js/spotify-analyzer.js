import GetJSON from 'get-json';
import Cookies from 'lib/js.cookie';

/**
 * Class representing an interface with the Spotify API which allows for processing all data for currently playing track.
 *
 * @prop {object} endpoints     - API endpoints.
 * @prop {object} currentTrack  - Data for currently playing track.
 * @prop {object} trackAnalysis - Track analysis data.
 * @prop {object} trackFeatures - Track features data.
 * @prop {object} intervals     - Track interval data.
 */
class SpotifyAnalyzer {
  /** Create API interface. */
  constructor(demo) {
    this.demo = demo;
    this.demoSongs = ['australia', 'electric_feel', 'lightness'];

    if (this.demo === true) { this.activeDemo = _.sample(this.demoSongs); }

    this.endpoints = {
      nowPlaying    : 'https://api.spotify.com/v1/me/player/currently-playing',
      trackAnalysis : 'https://api.spotify.com/v1/audio-analysis',
      trackFeatures : 'https://api.spotify.com/v1/audio-features'
    };

    this.accessToken = Cookies.get('KALEIDOSYNC_ACCESS_TOKEN');
    this.refreshToken = Cookies.get('KALEIDOSYNC_REFRESH_TOKEN');
    this.refreshCode = Cookies.get('KALEIDOSYNC_REFRESH_CODE');

    this.headers = {
      Authorization : 'Bearer ' + this.accessToken,
      Accept        : 'application/json'
    };

    this.currentTrack = {};
    this.trackAnalysis = {};
    this.trackFeatures = {};
    this.trackProgress = {};
    this.intervals = {
      types: ['tatums', 'segments', 'beats', 'bars', 'sections'],
      active: {},
      next: {},
      last: {},
      initial: {},
      hooks: {}
    };

    this.intervals.types.forEach((type) => {
      this.intervals.active[type] = {};
      this.intervals.next[type] = {};
      this.intervals.initial[type] = {};
    });
  }

  /**
   * Get currently playing track.
   * @param {function} callback 
   */
  getCurrentTrack(callback) {
    let delay    = window.performance.now(),
        endpoint = (this.demo === true) ? `/static/data/currently-playing-${this.activeDemo}.json` : this.endpoints.nowPlaying;

    GetJSON(endpoint, (response) => {
      delay = window.performance.now() - delay;

      callback(response, delay);
    }, { headers: this.headers });
  }

  /**
   * Get current track features and analysis.
   * @param {function} callback 
   */
  getTrackData(callback) {
    let callbackIndex = 0,
        trackFeatures = (this.demo === true) ? `/static/data/track-features-${this.activeDemo}.json` : this.endpoints.trackFeatures + '/' + this.currentTrack.item.id,
        trackAnalysis = (this.demo === true) ? `/static/data/track-analysis-${this.activeDemo}.json` : this.endpoints.trackAnalysis + '/' + this.currentTrack.item.id;

    GetJSON(trackFeatures, (response) => {
      this.trackFeatures = response;
      callbackIndex++;

      if (callbackIndex === 2 && typeof callback === 'function')
        callback();
    }, { headers: this.headers });

    GetJSON(trackAnalysis, (response) => {
      this.trackAnalysis = response;
      callbackIndex++;

      if (callbackIndex === 2 && typeof callback === 'function')
        callback();
    }, { headers: this.headers }); 
  }
 
  /**
   * Determine initial intervals for each type.
   * @param {string} type
   */
  determineInitialIntervals(type) {
    for (let i = 0; i < this.trackAnalysis[type].length; i++) {
      this.updateTrackProgress();  

      if (i === (this.trackAnalysis[type].length - 1)) {
        this.intervals.active[type] = this.trackAnalysis[type][i];
        this.intervals.initial[type] = this.trackAnalysis[type][i];
        this.intervals.active[type].index = i;
        this.intervals.initial[type].index = i;

        return;
      }

      /** Determine if current track progress falls within current interval. */
      if (this.trackAnalysis[type][i].start < this.trackProgress.progress/1000 && this.trackProgress.progress/1000 < this.trackAnalysis[type][i + 1].start) {
        /** Set active, initial and next interval cache. */
        this.intervals.active[type] = this.trackAnalysis[type][i];
        this.intervals.initial[type] = this.trackAnalysis[type][i];
        this.intervals.next[type] = this.trackAnalysis[type][i + 1];
        
        /** Store index for future reference. */
        this.intervals.active[type].index = i;
        this.intervals.initial[type].index = i;
        this.intervals.next[type].index = i;
        
        break;
      }
    }
  }

  /**
   * Execute interval hooks.
   * 
   * @param {string}  type           - Type of interval (tatum, segment, beat, bar, section)
   * @param {object}  interval       - Interval to be processed.
   * @param {number}  index          - Index of interval.
   * @param {boolean} initial        - Indicates whether this is the first hook execution.
   * @prop  {number}  recursionDelay - Delay before method is recursively called again.
   */
  executeIntervalHooks(type, interval, index, initial) {   
    /** Return if interval is invalid. */
    if (!interval)
      return;

    let recursionDelay = 0;

    /** Update active, next, and last interval references. */
    this.intervals.active[type] = interval;
    this.intervals.next[type] = this.trackAnalysis[type][index + 1] || null;
    this.intervals.last[type] = this.trackAnalysis[type][index - 1] || null;

    if (!this.intervals.next[type] || typeof this.intervals.hooks[type] !== 'function')
      return;

    /** Call interval hooks, updating track progress before and after. */
    this.updateTrackProgress();
    this.intervals.hooks[type].bind(this).call();
    this.updateTrackProgress();

    /** Determine recursion delay. */
    if (initial === true) {      
      recursionDelay = (this.intervals.next[type].start * 1000) - this.trackProgress.progress;
    } else {
      recursionDelay = (interval.duration * 1000) - (this.trackProgress.progress - (interval.start * 1000));
    }

    /** Resursively call executeIntervalHooks() when current interval completes. */
    this.intervals.active[type].timeout = setTimeout(() => {
      this.executeIntervalHooks(type, this.intervals.next[type], index + 1, false);
    }, recursionDelay);
  }

  /** Remove all hooks. */
  removeHooks() {
    this.intervals.types.forEach((type) => {
      delete this.intervals.hooks[type];
    });
  }

  /** Update current track progress based on current time. */
  updateTrackProgress() {
    this.trackProgress = { 
      progress: this.trackProgress.progress + (window.performance.now() - this.trackProgress.timestamp ),
      timestamp: window.performance.now()
    };
  }

  /** Initialize interval tracking & hooks. */
  initializeHooks() {    
    this.intervals.types.forEach((type) => {
      this.trackAnalysis[type][0] = Object.assign({}, this.trackAnalysis[type][0], {
        start: 0,
        duration: this.trackAnalysis[type][0].start + this.trackAnalysis[type][0].duration
      });

      this.determineInitialIntervals(type);
      this.executeIntervalHooks(type, this.intervals.active[type], this.intervals.active[type].index, true);
    });
  }
}

export default SpotifyAnalyzer;