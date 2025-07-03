<template>
  <View>
    <Shader :shader="sketches.shader" :volume="sources.volume" :stream="sources.stream" :uniforms="sketches.uniforms" />
  </View>
</template>

<script setup lang="ts">
import { View, Shader, useSketches, useSources, useClickOnce } from "@wearesage/vue";

const sketches = useSketches();
const sources = useSources();

useClickOnce(sources.toggle);
</script>

<route lang="json">
{
  "name": "Gist",
  "meta": {
    "description": "view shared content",
    "requiresAuth": false
  }
}
</route>
