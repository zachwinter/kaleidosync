<template>
  <View>
    <HomepageHero />
  </View>
</template>

<script setup lang="ts">
import { View } from "@wearesage/vue";
import { HomepageHero } from "../components";
</script>

<route lang="json">
{
  "name": "Homepage",
  "meta": {
    "description": "the homepage",
    "requiresAuth": false,
    "redirectWhenAuthenticated": "/visualizer"
  }
}
</route>
