<template>
  <nav>
    <AudioSourceButton @click="$emit('open-sources')" />

    <IconButton
      v-if="sources.source === AudioSource.AUDIUS"
      to="/audius"
      :label="state.showMenuLabels ? 'Library' : undefined"
      icon="vinyl" />

    <IconButton icon="eye" :label="state.showMenuLabels ? 'Designs' : undefined" @click="$emit('open-designs')" />

    <IconButton to="/design" icon="sliders" :label="state.showMenuLabels ? 'Customize' : undefined" />

    <IconButton to="/settings" icon="settings" :label="state.showMenuLabels ? 'Settings' : undefined" />

    <IconButton @click="share" icon="share" :label="state.showMenuLabels ? 'Share' : undefined" />

    <IconButton
      v-if="viewport.fullscreenSupported"
      @click="viewport.toggleFullscreen"
      icon="fullscreen"
      :label="state.showMenuLabels ? 'Fullscreen' : undefined" />
  </nav>
</template>

<script setup lang="ts">
import { IconButton, useViewport, useSources, useNativeShare, AudioSourceButton } from "@wearesage/vue";
import { AudioSource } from "@wearesage/shared";

defineEmits(["open-sources", "open-designs"]);

const viewport = useViewport();
const sources = useSources();
const share = useNativeShare();

const state = {
  showMenuLabels: false
};
</script>

<style lang="scss" scoped>
nav {
  @include fixed-menu;
}
</style>
