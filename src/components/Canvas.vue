<template lang="pug">
canvas(ref="canvas" :width="artboard.width" :height="artboard.height" :style="{ width: css.width, height: css.height }")
</template>

<script>
export default {
  data: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    dpi: 1,// window.devicePixelRatio,
    offscreens: []
  }),
  computed: {
    artboard () {
      return {
        width: this.width * this.dpi,
        height: this.height * this.dpi
      }
    },
    css () {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  mounted () {
    this.initCtx()
    window.addEventListener('resize', this.onResize.bind(this))
  },
  destroyed () {
    window.removeEventListener('resize', this.onResize.bind(this))
  },
  methods: {
    initCtx () {
      if (this.$refs.canvas) {
        this.ctx = this.$refs.canvas.getContext('2d')
        this.ctx.resetTransform()
        this.ctx.scale(this.dpi, this.dpi)
      }
      this.offscreens.forEach(ctx => {
        ctx.canvas.width = this.artboard.width
        ctx.canvas.height = this.artboard.height
        ctx.resetTransform()
        ctx.scale(this.dpi, this.dpi)
      })
    },
    async onResize () {
      this.width = window.innerWidth
      this.height = window.innerHeight
      await this.$nextTick()
      this.initCtx()
    },
    createOffscreen () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = this.artboard.width
      canvas.height = this.artboard.height
      ctx.scale(this.dpi, this.dpi)
      this.offscreens.push(ctx)
      return { ctx }
    },
    clear (ctx, size = null) {
      ctx.clearRect(0, 0, size || this.width, size || this.height)
    }
  }
}
</script>