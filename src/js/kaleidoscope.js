import Visualizer from 'visualizer';
import _ from 'lib/lodash';

/**
 * Class representing a kaleidoscope-inspired music visualizer.
 * @extends Visualizer
 *
 * @prop {number} totalStars        - Total number of stars (each ring of kaleidoscope).
 * @prop {array}  stars             - Array containing references to each star and their respective tweens.
 * @prop {number} maxSize           - Maximum size of each star, based on container height.
 * @prop {number} minSize           - Minimum size of each star.
 * @prop {number} activeSize        - Active maximum size; this will change based on loudness of each segment interval.
 * @prop {array}  colorSchemes      - Available color schemes for each rendered kaleidoscope.
 * @prop {array}  activeColorScheme - Active color scheme, selected randomly from available color schemes.
 * @prop {object} background        - Reference to background element and tween instance.
 */
class Kaleidoscope extends Visualizer {
  /** 
   * Create a kaleidoscope visualizer.
   * @param {string} container - ID of our parent canvas element.
   */
  constructor(container) {
    super(container);

    this.totalStars = 16;
    this.stars = [];
    this.maxSize = this.containerSize.height * (2/3);
    this.minSize = 10;
    this.activeSize = this.maxSize;
    this.colorSchemes = [
      ['#ff9f1c', '#ffbf69', '#cbf3f0', '#2ec4b6', '#ffffff'],
      ['#e56399', '#d2f1e4', '#fbcaef', '#48304d', '#ffffff'],
      ['#c60042', '#ff77a8', '#e2ceef', '#ffc6d9', '#ffffff'],
      ['#76e5fc', '#1b9aaa', '#9dacff', '#3d348b', '#eefbff'],
      ['#0a2463', '#3e92cc', '#fffaff', '#d8315b', '#271b18']
    ];
    this.activeColorScheme = _.sample(this.colorSchemes);
    this.background = {
      el: {},
      tween: {}
    };

    this.setEventHooks();
    this.init();
  }

  /** Create base elements, add them to canvas, then draw. */
  createElements() {    
    /** Create background element. */
    this.background.el = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.containerSize.width,
      height: this.containerSize.height,
      fill: '#fff'
    });

    /** Add background to canvas. */
    this.canvas.add(this.background.el);

    /** Create stars. */
    for (let i = 0; i < this.totalStars; i++) 
      this.createStar(i);

    /** Draw canvas. */
    this.canvas.draw();
  }

  /**
   * Create a single star and add it to canvas.
   * @param {number} index     - Used to randomize number of points on each star.
   * @prop {number}  numPoints - Default number of points on star.
   * @prop {star}    star      - Instance of Konva.Star()
   */
  createStar(index) {
    let numPoints = 16;

    /** Number of points on every 2nd, 3rd and 4th stars. */
    if ((index + 1) % 2 === 0)
      numPoints = 24;
    if ((index + 1) % 3 === 0)
      numPoints = 8;
    if ((index + 1) % 4 === 0)
      numPoints = 32;

    /** Create star element. */
    let star = new Konva.Star({
      x : this.containerSize.width/2, y : this.containerSize.height/2,
      numPoints: numPoints,
      width: this.activeSize,
      height: this.activeSize,
      fill: '#fff',
      innerRadius: 0,
      outerRadius: this.activeSize
    });

    /** Add star element to stars array for future reference. */
    this.stars.push({
      el: star,
      tween: {
        colors: {},
        all: {}
      }
    });

    /** Add star to canvas. */
    this.canvas.add(star);
  }

  /** 
   * Create Konva.Tween() instance for width, height, outerRadius, innerRadius, and duration.
   * @param {number} duration  - Duration of tween in seconds.
   * @prop  {array}  sizeStep  - Possible iterative steps for sizing down the next star.
   * @prop  {array}  radius    - Multipliers for innerRadius of each star, multiplied by star size. 
   * @prop  {number} size      - Starting max size, to be stepped dow per sizeSteps. 
   */
  shapeStyles(duration) {
    const sizeStep = [
      ((this.maxSize / this.totalStars) * 0.7),
      ((this.maxSize / this.totalStars) * 0.8),
      ((this.maxSize / this.totalStars) * 1.0)
    ];

    const radius = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];

    let size = this.activeSize;

    this.stars.forEach((star) => {
      /** Reduce size with a random value from sizeStep. */
      size = parseInt(size - _.sample(sizeStep));

      /** Ensure size is at least our decided minimum size. */
      if (size < this.minSize )
        size = this.minSize;

      /** If tween already exists, pause it. */
      if (star.tween.all.pause)
        star.tween.all.pause();

      /** Create tween instance. */
      star.tween.all = new Konva.Tween({
        node: star.el,
        outerRadius: size,
        width: size,
        height: size,
        innerRadius: size * _.sample(radius),
        duration: duration,
        easing: Konva.Easings.EaseIn
      });

      /** Play tween instance. */
      star.tween.all.play();
    });
  }

  /** 
   * Create Konva.Tween() instance for fill and duration.
   * @param {number}  duration        - Duration of tween in seconds.
   * @param {boolean} styleBackground - Determines if we're styling background or star elements.
   * @prop  {array}   colorScheme     - Clone of this.activeColorScheme, but with added negative space values.
   * @prop  {string}  negativeSpace   - Hex value of color to be used as negative space, sampeld from active color scheme.
   */
  colorStyles(duration, styleBackground) {
    let colorScheme   = this.activeColorScheme.slice(),
        negativeSpace = _.sample(colorScheme)

    /** Conditional background styling. */
    if (styleBackground === true) {
      /** If tween already exists, pause it. */
      if (this.background.tween.pause)
        this.background.tween.pause();

      /** Create tween instance using color scheme negative space. */
      this.background.tween = new Konva.Tween({
        node: this.background.el,
        fill: negativeSpace,
        duration: duration,
        easing: Konva.Easings.EaseIn
      });

      /** Play tween instance. */
      this.background.tween.play();

      return;
    }

    /** Add negative space to color scheme. */
    colorScheme.push(negativeSpace, negativeSpace, negativeSpace, negativeSpace);
  
    this.stars.forEach((star) => {
      /** Grab random color from color scheme. */
      let color = _.sample(colorScheme);

      /** If tween already exists, pause it. */
      if (star.tween.colors.pause)
        star.tween.colors.pause();

      /** Create tween instance using random color from color scheme. */
      star.tween.colors = new Konva.Tween({
        node: star.el,
        duration: duration,
        fill: color,
        easing: Konva.Easings.EaseIn
      });

      /** Play tween instance. */
      star.tween.colors.play();
    });   
  }

  setEventHooks() {
    this.events.beforeInit = () => {
      this.containerElement.style.transition = 'opacity 2s ease-in-out';
      this.createElements();
    };

    this.events.beforeStart = () => {
      this.setIntervalHooks();
    };

    this.events.afterStart = () => {
      this.containerElement.style.opacity = 1;
    };

    this.events.beforeStop = () => {
      this.containerElement.style.opacity = 0;
    };
  }
  
  setIntervalHooks() {
    this.intervals.hooks.tatums = () => {
      let duration = this.intervals.active.tatums.duration;

      this.shapeStyles(duration); 
    };

    this.intervals.hooks.segments = () => {
      let nextLoudness = this.intervals.next.segments ? this.intervals.next.segments.loudness_max : this.intervals.active.segments.loudness_max,
          lastLoudness = this.intervals.last.segments ? this.intervals.last.segments.loudness_max : this.intervals.active.segments.loudness_max,
          activeLoudness = (this.intervals.active.segments.loudness_max + nextLoudness + lastLoudness)/3;

      this.activeSize = (this.maxSize - (activeLoudness * -10)) + (this.trackFeatures.loudness * -10);
    };

    this.intervals.hooks.beats = () => {
      let duration = this.intervals.active.beats.duration;

      this.colorStyles(duration, false); 
    };

    this.intervals.hooks.bars = () => {
      let duration = this.intervals.active.bars.duration;

      this.activeColorScheme = _.sample(this.colorSchemes);

      this.colorStyles(duration, true);
    };
  } 
}

export default Kaleidoscope;