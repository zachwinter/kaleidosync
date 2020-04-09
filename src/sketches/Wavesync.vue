<template lang="pug">
.wavesync
  Canvas(ref="canvas")
</template>

<script>
import visualizer from '@/mixins/visualizer'
import { interpolateBasis, interpolateRgbBasis } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import { color } from 'd3-color'
import ease from '@/util/ease'
import { TWO_PI, PI_OVER_180 } from '@/util/canvas'
import Canvas from '@/components/Canvas'

export default {
  mixins: [visualizer],
  
  components: { Canvas },

  mounted () {
    this.theme = [
      color('#FFE66D'), // yellow
      color('#4ECDC4'), // turqoise
      color('#FF6B6B'), // red,
      color('#292F36')  // black
    ]

    this.overlayColors = [
      color('#18FF2A'), 
      color('#7718FF'), 
      color('#06C5FE'), 
      color('#FF4242'), 
      color('#18FF2A')
    ].map(({ r, g, b }) => `rgba(${r}, ${g}, ${b}, 1)`)

    this.easing = 'easeInOutQuint'
    this.registerVolumeQueue('wavesync-beat', 80, 30)
    this.registerVolumeQueue('wavesync-volume', 150, 50)
    this.setGradients()
    this.setCtxParams()
    this.setScales()

    window.addEventListener('resize', () => {
      this.setGradients()
      this.setCtxParams()
    })
  },

  methods: {
    setGradients () {
      const { width, height } = this.$refs.canvas
      const gradientRadius = (height > width)
        ? height / 2
        : width / 2

      const center = {
        x: width / 2,
        y: height / 2
      }

      this.gradient = this.$refs.canvas.ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, gradientRadius)
      this.gradient.addColorStop(0, this.theme[0])
      this.gradient.addColorStop(0.5, this.theme[1])
      this.gradient.addColorStop(1, this.theme[0])

      this.gradient2 = this.$refs.canvas.ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, gradientRadius / 3)
      this.gradient2.addColorStop(0, this.theme[0])
      this.gradient2.addColorStop(0.5, this.theme[1])
      this.gradient2.addColorStop(1, this.theme[0])

      this.gradient3 = this.$refs.canvas.ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, gradientRadius)
      this.gradient3.addColorStop(0, this.theme[2])
      this.gradient3.addColorStop(1, this.theme[0])
    },

    setCtxParams () {
      this.$refs.canvas.ctx.lineCap = 'round'
      this.$refs.canvas.ctx.lineJoin = 'round'
    },

    setScales () {
      this.rotationScale = scaleLinear()
        .domain([0, 1])
        .range([3000, 1200])

      this.radiusScale = scaleLinear()
        .domain([0, .3, .6, 1])
        .range([.5, 1, 1.1, 1.2])

      this.smoothingScale = scaleLinear()
        .domain([0, 1])
        .range([100, 30])
    },

    createPath (ctx, { x, y }, iterations = 1) {
      ctx.beginPath()
      for (var i = 0; i < iterations * TWO_PI; i += PI_OVER_180) {
        const _x = x(i)
        const _y = y(i)
        if (i === 0) {
          ctx.moveTo(_x, _y)
        } else {
          ctx.lineTo(_x, _y)
        }
      }
    },

    paintBackground ({ ctx, width, height }) {
      this.$refs.canvas.ctx.fillStyle = this.gradient3
      ctx.fillRect(0, 0, width, height)
    },

    paintOuterLines ({ ctx, width, height, now }) {
      const progress = ease(this.activeIntervals.beats.progress, this.easing)
      const base = (width > height) ? width / 10 : height / 10
      const volume = this.getVolumeQueue('wavesync-beat') //this.sync.volume
      const iAmp = interpolateBasis([volume * -base, volume * base, volume * -base]) 
      const amp = iAmp(progress) * this.radiusScale(this.trackFeatures.energy) * .66
      const radius = (width > height) ? volume * height / 3 : volume * width / 3
      const x = ANGLE => (radius + amp * Math.sin(7 * (ANGLE + now/this.rotationScale(this.trackFeatures.energy)))) * Math.tan(ANGLE) + width/2
      const y = ANGLE => (radius + amp * Math.sin(7 * (ANGLE + now/this.rotationScale(this.trackFeatures.energy)/2))) * Math.cos(ANGLE) + height/2

      this.createPath(ctx, { x, y })
      
      ctx.lineWidth = (volume * 5)
      ctx.strokeStyle = this.gradient
      ctx.stroke()
      ctx.fillRect(0, (height/2) - (volume * 20), width, volume * 40)
    },

    paintInnerLines ({ ctx, width, height, now }) {
      const progress = ease(this.activeIntervals.bars.progress, this.easing)
      const volume = this.getVolumeQueue('wavesync-beat')//this.sync.volume
      const amp = interpolateBasis([volume * (height / 5), volume * (height / 5)])(progress)
      const radius = (width > height) ? volume * height / 3 : volume * width / 3
      const x = ANGLE => (radius + amp * Math.sin(2.019 * (ANGLE + now/this.rotationScale(this.trackFeatures.energy) * 8))) * Math.cos(ANGLE) + width/2
      const y = ANGLE => (radius + amp * Math.sin(2.019 * (ANGLE + now/this.rotationScale(this.trackFeatures.energy) * 4))) * Math.sin(ANGLE) + height/2

      this.createPath(ctx, { x, y }, 15)

      ctx.lineWidth = Math.min(volume, 1)
      ctx.strokeStyle = this.gradient2
      ctx.stroke()
    },

    paintCenter ({ ctx, width, height, now }) {
      const progress = ease(this.activeIntervals.beats.progress, this.easing)
      const base = (width < height) ? width / 5 : height / 5
      const volume = this.getVolumeQueue('wavesync-volume')
      const iAmp = interpolateBasis([volume * -base, volume * base, volume * -base]) 
      const amp = iAmp(progress) * this.radiusScale(this.trackFeatures.energy) 
      const radius = (width > height) ? volume * height / 3 : volume * width / 3
      const x = ANGLE => (radius + amp*.5 * Math.sin(7 * (ANGLE + now/this.rotationScale(this.trackFeatures.energy)*4))) * Math.cos(ANGLE) + width/2
      const y = ANGLE => (radius + amp*.5 * Math.sin(7 * (ANGLE + now/this.rotationScale(this.trackFeatures.energy)))) * Math.sin(ANGLE) + height/2
      const iLineWidth = interpolateBasis([volume * (width > height ? width : height) / 30, volume , volume  * (width > height ? width : height) / 30])

      this.createPath(ctx, { x, y })

      ctx.lineWidth = iLineWidth(ease(this.activeIntervals.beats.progress, 'linear'))
      ctx.strokeStyle = this.gradient
      ctx.stroke()
    },

    paintOverlay ({ ctx, width, height, now }) {
      if (!this.backgroundTick) {
        this.backgroundTick = now
      }

      const backgroundProgress = Math.min((now - this.backgroundTick) / 10000, 1)
      ctx.save()
      ctx.globalCompositeOperation = 'overlay'
      ctx.fillStyle = interpolateRgbBasis(this.overlayColors)(backgroundProgress)
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      if (backgroundProgress === 1) {
        this.backgroundTick = now
      }
    },

    paint (now) {
      const { width, height } = this.$refs.canvas
      const args = {
        width,
        height,
        now,
        ctx: this.$refs.canvas.ctx
      }

      this.setCtxParams()
      this.paintBackground(args)
      this.paintOuterLines(args)
      this.paintInnerLines(args)
      this.paintCenter(args)
      this.paintOverlay(args)
    }
  }
}
</script>

<style>

</style>