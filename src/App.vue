<template>
  <Root />
  <Renderer />
  <Toast />
  <Popover />
</template>

<script lang="ts" setup>
import { Root, Toast, Popover } from "@wearesage/vue";
import Renderer from "./components/Renderer.vue";
</script>

<style lang="scss">
@import "@wearesage/vue/css";
@import "@wearesage/vue/styles/appkit-custom.css";
</style>
