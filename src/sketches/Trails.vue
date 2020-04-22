<template lang="pug">
.trails
  transition(name="fadeyn")
    TrailsGUI(v-if="hover && !menuVisible")
  Canvas(ref="canvas")
</template>

<script>
import { mapState } from 'vuex'
import TrailsGUI from '@/components/TrailsGUI'
import visualizer from '@/mixins/visualizer'
import { polygon, growingLine, toRadians } from '@/util/canvas'
import ease from '@/util/ease'
import interpolateBasis from 'd3-interpolate/src/basis'
import { rgbBasis } from 'd3-interpolate/src/rgb'
import { hsl } from 'd3-color/src/color'

export const WIDTH_CONSTANT = 80

export default {
  mixins: [visualizer],
  components: { TrailsGUI },
  data: () => ({
    model: null,
    offscreenSize: null
  }),
  computed: mapState({
    trailsModel: ({ trails }) => trails.model,
    background: ({ trails }) => trails.background,
    beatInterval: ({ spotify }) => spotify.beatInterval,
    hover: ({ ui }) => ui.hover,
    menuVisible: ({ ui }) => ui.menuVisible
  }),
  watch: {
    trailsModel () {
      this.initModel()
    }
  },
  mounted () {
    this.registerQueues()
    this.registerOffscreens()
    this.initModel()
    this.colors = [
      hsl('red'),
      hsl('blue'),
      hsl('yellow'),
      hsl('green'),
      hsl('blue'),
      hsl('purple'),
      hsl('red')
    ].map(color => {
      return color
    })
    this.colorIndex = 0
    this.iColor = rgbBasis(this.colors)
  },
  methods: {
    registerQueues () {
      this.registerVolumeQueue('trails-a', 200, 20)
      this.registerVolumeQueue('trails-b', 800, 80)
    },

    registerOffscreens () {
      const { ctx: arm, size } = this.$refs.canvas.createOffscreen()
      const { ctx: group } = this.$refs.canvas.createOffscreen()
      this.arm = arm
      this.group = group
      this.offscreenSize = size
    },

    initModel () {
      this.model = this.trailsModel.map(({ sides }) => {
        const model = []
        for (let i = 0; i < sides; i++) {
          model.push([])
        }
        return model
      })
    },

    ease (t) {
      return ease(t, 'easeOutCubic')
    },

    clear () {
      const { width, height, ctx } = this.$refs.canvas
      const { r, g, b, a } = this.background.rgba
      ctx.save()
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    },

    onBar () {
      const from = this.colors[this.colorIndex]
      if (this.colorIndex === this.colors.length -1) {
        this.colorIndex = 0
      } else {
        this.colorIndex++
      }
      const to = this.colors[this.colorIndex]
      this.iColor = rgbBasis([from, to])
    },

    paintGroup ({ config }, index) {
      const { width, height } = this.$refs.canvas

      const a = this.getVolumeQueue('trails-a')
      const b = this.getVolumeQueue('trails-b')
      // const c = this.getVolumeQueue('trails-c')
      const volume = b * a
      const base = (Math.min(width, height) / 2) * parseFloat(config.radius)
      const beat = interpolateBasis([0, 4 * volume, 0])(ease(this[this.beatInterval].progress, 'easeOutCubic'))
      const radius = (base + (base * a) + (base * beat)) * a
      const vertices = polygon(config.sides, radius, width/2, height/2, this.now * config.rotation)
      vertices.forEach(({ x, y }, i) => {
        this.model[index][i].push({ x, y, scale: volume })
        while (this.model[index][i].length > config.length) this.model[index][i].shift()
        const r = WIDTH_CONSTANT * config.width
        this.arm.fillStyle = this.iColor(this.bar.progress)
        const iRadius = interpolateBasis([0, r, 0])
        const iRotation = interpolateBasis([0, 90, 0])
        for (let j = 0; j < this.model[index][i].length - 1; j++) {
          const easing = 'linear'
          const p1 = ease((j/(this.model[index][i].length - 1)), easing)
          const p2 = ease((j+1)/(this.model[index][i].length - 1), easing)
          const r1 = iRadius(p1)
          const r2 = iRadius(p2)
          if (config.scale) {
            this.arm.save()
            this.arm.resetTransform()
            this.arm.translate(width/2, height/2)
            const rotation = toRadians(iRotation(p1))
            this.arm.rotate(rotation)
            this.arm.translate(-width/2, -height/2)
          }
          const x1 = this.model[index][i][j].x 
          const y1 = this.model[index][i][j].y
          const x2 = this.model[index][i][j + 1].x
          const y2 = this.model[index][i][j + 1].y
          growingLine(this.arm, x1, y1, x2, y2, r1, r2)
          this.arm.fill()
          this.arm.restore()
        }
      })

      this.arm.save()
      this.arm.translate(width/2, height/2)
      this.arm.scale(-1, 1)
      this.arm.translate(-width/2, -height/2)
      this.arm.drawImage(this.arm.canvas, 0, 0)
      this.arm.restore()
    },

    applyGroup ({ config }) {
      const { ctx, width, height } = this.$refs.canvas
      ctx.save()
      ctx.shadowBlur = (WIDTH_CONSTANT * config.width) / 3
      ctx.shadowColor = this.iColor(this.bar.progress) // config.color.hex
      ctx.globalCompositeOperation = 'lighter'
      ctx.drawImage(this.arm.canvas, 0, 0, width, height)
      ctx.restore()
    },

    paint () {
      if (!this.$refs.canvas) return
      let { width, height, clear } = this.$refs.canvas
      const beat = this.ease(this[this.beatInterval].progress)
      this.now = this.now || 0
      this.now += interpolateBasis([0, 100, 0])(beat)
      this.clear()
      clear(this.arm, this.offscreenSize)
      this.trailsModel.forEach((config, i) => {  
        this.paintGroup({ config, width, height }, i)
      })
      this.applyGroup({ config: this.trailsModel[0], width, height })
    }
  }
}
</script>