import _ from 'lib/lodash';
import Visualizer from 'visualizer';
import Canvas from 'classes/canvas';
import Star from 'classes/star';
import Rectangle from 'classes/rectangle';

export default class Kaleidoscope extends Visualizer {
  constructor(demo, interval) {
    super(demo)

    this.initialized = false;
    this.interval = interval;
    this.intervalTimeout = this.interval ? {} : false;
    this.canvas = new Canvas('kaleidoscope');
    this.totalStars = 16; 
    this.maxSize = .7 * (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
    this.minSize = this.maxSize / 5;
    this.activeSize = this.intervalTimeout !== false ? this.maxSize : this.minSize;
    this.sizeStep = [
      ((this.maxSize / this.totalStars) * 0.4),
      ((this.maxSize / this.totalStars) * 0.6),
      ((this.maxSize / this.totalStars) * 0.8)
    ];
    this.radiusStep = [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2];
    this.colorSchemes = [
      ['rgb(255,159,28)',  'rgb(255,191,105)', 'rgb(203,243,240)', 'rgb(46,196,182)',  'rgb(255,255,255)'],
      ['rgb(229,99,153)',  'rgb(210,241,228)', 'rgb(251,202,239)', 'rgb(72,48,77)',    'rgb(255,255,255)'],
      ['rgb(198,0,66)',    'rgb(255,119,168)', 'rgb(226,206,239)', 'rgb(255,198,217)', 'rgb(255,255,255)'],
      ['rgb(118,229,252)', 'rgb(27,154,170)',  'rgb(157,172,255)', 'rgb(61,52,139)',   'rgb(238,251,255)'],
      ['rgb(10,36,99)',    'rgb(62,146,204)',  'rgb(255,250,255)', 'rgb(216,49,91)',   'rgb(39,27,24)']
    ];
    this.setActive
    this.duration = 100; 
    this.radiusDuration = 1000;
    this.colorDuration = 1000;
    this.backgroundDuration = 1000;
    this.refreshRate = 1000/60;

    this.model = {
      stars: {
        last: [],
        active: []
      },
      background: {
        last: {},
        active: {}
      }
    };

    let colors   = _.sample(this.colorSchemes),
        negative = _.sample(colors),
        negArray = [negative, negative, negative, negative];

    this.activeColorScheme = colors.concat(negArray);

    if (this.interval !== true) {
      this.setEventHooks();
      this.init();
    } else {
      this.buildSingleState(true);
    }
  }

  initElements() {
    if (this.initialized === true) {
      return;
    }

    for (var i = 0; i < this.totalStars; i++) {
      let numPoints = 16;

      if ((i + 1) % 2 === 0)
        numPoints = 24;
      if ((i + 1) % 3 === 0)
        numPoints = 8;
      if ((i + 1) % 4 === 0)
        numPoints = 32;

      let starState = {
        x: this.canvas.width/2,
        y: this.canvas.height/2,
        points: numPoints,
        color: 'rgb(255,255,255)',
        innerRadius: 0,
        outerRadius: 0
      };

      let star = new Star(starState);

      this.model.stars.active[i] = starState;
      this.model.stars.last[i] = starState;

      this.canvas.addStar(star);
    }

    let backgroundState = {
      color: 'rgb(255,255,255)',
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.model.background.active = backgroundState;
    this.model.background.last = backgroundState;

    this.canvas.addBackground(new Rectangle(backgroundState));

    this.initialized = true;
  }

  setRadiusState() {
    let size = this.activeSize;

    for (var i = 0; i < this.totalStars; i++) {
      size = parseInt(size - _.sample(this.sizeStep));

      if (size < this.minSize ) {
        size = this.minSize;
      }

      clearInterval(this.canvas.stars[i].radiusTween);

      this.model.stars.last[i].innerRadius = this.model.stars.active[i].innerRadius;
      this.model.stars.last[i].outerRadius = this.model.stars.active[i].outerRadius;

      this.model.stars.active[i].innerRadius = size * _.sample(this.radiusStep);
      this.model.stars.active[i].outerRadius = size;
    }
  }

  setColorState() {
    for (var i = 0; i < this.totalStars; i++) {
      clearInterval(this.canvas.stars[i].colorTween);

      this.model.stars.last[i] = Object.assign({}, this.model.stars.last[i], {
        color: this.model.stars.active[i].color
      });

      this.model.stars.active[i].color = _.sample(this.activeColorScheme);
    }
  }

  setBackgroundState(negative) {
    this.model.background.last = Object.assign({}, this.model.background.last, {
      color: this.model.background.active.color
    });

    this.model.background.active = Object.assign({}, this.model.background.active, {
      color: negative
    })
  }

  tweenStarRadius(ms) {
    let duration = ms ? ms : this.radiusDuration;

    for (let i = 0; i < this.totalStars; i++) {
      let star = this.canvas.stars[i];

      let nextState = this.model.stars.active[i],
          lastState = this.model.stars.last[i];

      let innerRadiusStep = (nextState.innerRadius - lastState.innerRadius) / (duration / this.refreshRate),
          outerRadiusStep = (nextState.outerRadius - lastState.outerRadius) / (duration / this.refreshRate);

      let tweeningInnerRadius = lastState.innerRadius,
          tweeningOuterRadius = lastState.outerRadius;

      star.radiusTween = setInterval(() => {
        tweeningInnerRadius = tweeningInnerRadius + innerRadiusStep;
        tweeningOuterRadius = tweeningOuterRadius + outerRadiusStep;

        nextState.innerRadius = tweeningInnerRadius;
        nextState.outerRadius = tweeningOuterRadius;

        star.update({
          innerRadius: tweeningInnerRadius,
          outerRadius: tweeningOuterRadius
        });
      }, this.refreshRate);
    }
  }

  tweenStarColor(ms) {
    let duration = ms ? ms : this.colorDuration;

    for (let i = 0; i < this.totalStars; i++) {
      let nextColor = this.model.stars.active[i].color.slice(4, -1).split(','),
          lastColor = this.model.stars.last[i].color.slice(4, -1).split(',');

      let stepR = (parseInt(nextColor[0]) - parseInt(lastColor[0])) / (duration / this.refreshRate),
          stepG = (parseInt(nextColor[1]) - parseInt(lastColor[1])) / (duration / this.refreshRate),
          stepB = (parseInt(nextColor[2]) - parseInt(lastColor[2])) / (duration / this.refreshRate);

      let tweenR = parseInt(lastColor[0]),
          tweenG = parseInt(lastColor[1]),
          tweenB = parseInt(lastColor[2]);

      this.canvas.stars[i].colorTween = setInterval(() => {
        tweenR = parseInt(tweenR + stepR);
        tweenG = parseInt(tweenG + stepG);
        tweenB = parseInt(tweenB + stepB);

        let color = `rgb(${tweenR}, ${tweenG}, ${tweenB})`;

        this.model.stars.active[i].color = color;

        this.canvas.stars[i].update({ color: color });
      }, this.refreshRate);
    }
  }

  tweenBackgroundColor(ms) {
    let duration = ms ? ms : this.backgroundDuration;

    let nextColor = this.model.background.active.color.slice(4, -1).split(','),
        lastColor = this.model.background.last.color.slice(4, -1).split(',');

    let stepR = (parseInt(nextColor[0]) - parseInt(lastColor[0])) / (duration / this.refreshRate),
        stepG = (parseInt(nextColor[1]) - parseInt(lastColor[1])) / (duration / this.refreshRate),
        stepB = (parseInt(nextColor[2]) - parseInt(lastColor[2])) / (duration / this.refreshRate);

    let tweenR = parseInt(lastColor[0]),
        tweenG = parseInt(lastColor[1]),
        tweenB = parseInt(lastColor[2]);

    this.canvas.background.tweenInterval = setInterval(() => {
      tweenR = parseInt(tweenR + stepR);
      tweenG = parseInt(tweenG + stepG);
      tweenB = parseInt(tweenB + stepB);

      let color = `rgb(${tweenR}, ${tweenG}, ${tweenB})`;

      this.model.background.active.color = color; 

      this.canvas.background.update({ color: color });
    }, this.refreshRate);
  }

  setActiveColorScheme(ms) {
    clearInterval(this.canvas.background.tweenInterval);

    let colors   = ms ? this.colorSchemes[0] : _.sample(this.colorSchemes),
        negative = _.sample(colors),
        negArray = [negative, negative, negative, negative];

    this.activeColorScheme = colors.concat(negArray);
    this.setBackgroundState(negative);
  }

  clearIntervals() {
    for (var i = 0; i < this.totalStars; i++) {
      clearInterval(this.canvas.stars[i].radiusTween);
      clearInterval(this.canvas.stars[i].colorTween);
    }

    clearInterval(this.canvas.background.tweenInterval);
  }

  buildSingleState(init) {
    this.activeSize = this.maxSize;

    if (init) {
      this.initElements();
    } 

    this.setActiveColorScheme(this.duration);
    this.setColorState();
    this.setRadiusState();

    if (init) {
      this.canvas.init();
    }

    this.tweenStarRadius(this.duration);
    this.tweenStarColor(this.duration); 
    this.tweenBackgroundColor(this.duration);

    if (init) { 
      this.buildSingleState();

      if (this.demo === true && this.interval === true) {
        setTimeout(() => {
          this.clearIntervals();
          this.canvas.stopPaint()
        }, this.duration);
      }
    }
  }

  setEventHooks() {
    this.events.beforeInit = () => {
      this.initElements();

      if (this.interval !== true) {
        this.setActiveColorScheme();
        this.setColorState();
        this.setRadiusState(true);
      } else {
        clearTimeout(this.intervalTimeout.timer);
      }

      if (this.canvas.initialized === false) {
        this.canvas.init();
      }
    };

    this.events.beforeStart = () => {
      this.setIntervalHooks();
    };
  }
  
  setIntervalHooks() {
    this.intervals.hooks.tatums = () => {
      this.radiusDuration = this.intervals.active.tatums.duration * 1000;

      this.setRadiusState();  
      this.tweenStarRadius(); 
    };

    this.intervals.hooks.segments = () => {
      let nextLoudness = this.intervals.next.segments ? this.intervals.next.segments.loudness_max : this.intervals.active.segments.loudness_max,
          lastLoudness = this.intervals.last.segments ? this.intervals.last.segments.loudness_max : this.intervals.active.segments.loudness_max,
          activeLoudness = (this.intervals.active.segments.loudness_max + nextLoudness + lastLoudness)/3;

      this.activeSize = (this.maxSize - (activeLoudness * -25)) + (this.trackFeatures.loudness * -10);
    };

    this.intervals.hooks.beats = () => {
      this.colorDuration = this.intervals.active.beats.duration * 1000;

      this.setColorState(); 
      this.tweenStarColor();
    };

    this.intervals.hooks.bars = () => {
      this.backgroundDuration = this.intervals.active.bars.duration * 1000;

      this.setActiveColorScheme();
      this.tweenBackgroundColor();
    };
  } 
}