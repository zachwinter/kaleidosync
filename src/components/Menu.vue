<template>
  <nav>
    <AudioSourceButton @click="$emit('open-sources')" />

    <IconButton
      v-if="sources.source === AudioSource.AUDIUS"
      to="/audius"
      :label="userState.showMenuLabels ? 'Library' : undefined"
      icon="vinyl" />

    <IconButton to="/design" icon="sliders" :label="userState.showMenuLabels ? 'Design' : undefined" />

    <IconButton to="/settings" icon="settings" :label="userState.showMenuLabels ? 'Settings' : undefined" />

    <IconButton @click="share" icon="share" :label="userState.showMenuLabels ? 'Share' : undefined" />

    <IconButton
      v-if="viewport.fullscreenSupported"
      @click="viewport.toggleFullscreen"
      icon="fullscreen"
      :label="userState.showMenuLabels ? 'Fullscreen' : undefined" />
  </nav>
</template>

<script setup lang="ts">
import { IconButton, useViewport, useSources, useNativeShare, useUserState, AudioSourceButton } from "@wearesage/vue";
import { AudioSource } from "@wearesage/shared";

defineEmits(["open-sources"]);

const viewport = useViewport();
const sources = useSources();
const share = useNativeShare();
const userState = useUserState();
</script>

<style lang="scss" scoped>
nav {
  @include fixed-menu;
}
</style>
