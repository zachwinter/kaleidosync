<template>
  <figure class="renderer" :style="styles" :class="{ show: ui.showShaderScroll }">
    <TresCanvas
      :width="width"
      :height="height"
      :dpr="dpr"
      class="canvas"
      render-mode="manual"
      :antialias="false"
      :alpha="false"
      :premultiplied-alpha="false"
      :preserve-drawing-buffer="false"
      power-preference="high-performance"
      ref="context">
      <TresPerspectiveCamera :position="[0, 0, 1]" />
      <SketchMesh
        ref="sketch"
        :key="renderIndex"
        :width="width"
        :height="height"
        :shader="sketches.shader"
        :uniforms="sketches.uniforms"
        :volume="sources.volume"
        :stream="sources.stream"
        :time="raf.time" />
      <ShaderScroll
        @select="selectSketch"
        ref="scroll"
        :scrollY="viewport.scrollY"
        :width="viewport.width"
        :height="viewport.height"
        :dpr="dpr"
        :visible="ui.showShaderScroll"
        :sketches="sketches.iterations"
        :volume="sources.volume"
        :stream="sources.stream"
        :time="raf.time" />
    </TresCanvas>
  </figure>
</template>

<script setup lang="ts">
import { computed, shallowRef, ref, watch, toRef } from "vue";
import {
  ShaderScroll,
  SketchMesh,
  useRAF,
  useSketches,
  useSources,
  useAnimation,
  useViewport,
  useDevice,
  useShaderErrorDetection,
  useRoute,
  useUI
} from "@wearesage/vue";

const raf = useRAF();
const sketches = useSketches();
const sources = useSources();
const route = useRoute();
const device = useDevice();
const ui = useUI();
const viewport = useViewport();
const width = computed(() => viewport.width);
const height = computed(() => viewport.height);
const dpr = computed(() => (1 ? 1 : device.isMobile ? 1 : 1));
const context = shallowRef();
const sketch = shallowRef();
const scroll = shallowRef();
const { error, setup, isSetup } = useShaderErrorDetection(toRef(sketches.shader));
const renderIndex = ref(0);

const styles = computed(() => {
  return {
    width: width.value + "px",
    height: height.value + "px",
    opacity: 1
  };
});

watch(
  () => route.value.path,
  () => {
    sketches.magicTween(1000);
  }
);

watch(error, val => {
  sketches.shaderError = val?.message ? val : null;
});

watch(
  () => [sketches.shader, sketches.uniformKeysSerialized],
  () => {
    renderIndex.value++;
  },
  {
    immediate: true,
    deep: true
  }
);

function selectSketch(s: any) {
  sketches.selectSketch(s);
  ui.showShaderScroll = false;
}

useAnimation(now => {
  if (!context.value?.context) return;
  const { renderer, scene, camera } = context.value?.context;
  if (!isSetup.value && route.value.path === "/design") setup(renderer.value);
  sketch.value?.update?.(now);
  scroll.value?.update?.(now);
  renderer.value.render(scene.value, camera.value);
});

if (!sketches.sketch) sketches.sampleSketches();

document.body.addEventListener("wheel", e => {
  raf.preFrame.push(() => {
    viewport.onScroll(e.deltaY);
  });
});
</script>

<style lang="scss" scoped>
figure {
  @include position(fixed, 0 0 null null, 1);
  @include size(100%);
  transition: all 1000ms $transition-easing;
}
</style>
