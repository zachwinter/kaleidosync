<template>
  <View>
    <nav>
      <MenuHeader title="settings" @close="router.push('/visualizer')" />
      <Column align="end" cascade>
        <Toggle label="Disable Flashing" v-model="userState.disableFlashing" />
        <Toggle label="Neon Mode" v-model="userState.neonMode" />
        <Toggle label="Show Menu Labels" v-model="userState.showMenuLabels" />
        <Toggle label="Always Show Track" v-model="userState.alwaysShowTrack" />
        <Toggle label="Shuffle Designs" v-model="userState.shuffleDesigns" />
        <Toggle label="Infinity Play" v-model="userState.infinityPlay" />
        <Toggle label="Prefer Lossless Audio" v-model="userState.preferLossless" />
        <RangeInput label="Speed" v-model="userState.visualizerSpeed" :min="0.25" :max="1.2" :step="0.001" />
      </Column>
    </nav>
  </View>
</template>

<script setup lang="ts">
import { View, Column, Toggle, RangeInput, useRouter } from "@wearesage/vue";
import { MenuHeader } from "../components";

const router = useRouter();

const userState = {
  disableFlashing: false,
  neonMode: false,
  showMenuLabels: false,
  shuffleDesigns: true,
  alwaysShowTrack: false,
  infinityPlay: false,
  preferLossless: false,
  visualizerSpeed: 1
};
</script>

<style lang="scss" scoped>
nav {
  @include fixed-menu;
}
</style>

<route lang="json">
{
  "name": "Settings",
  "meta": {
    "description": "configure the visualizer",
    "requiresAuth": true
  }
}
</route>
