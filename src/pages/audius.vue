<template>
  <View>
    <AudiusSearch />
    <Transition name="fade">
      <Column v-if="audius.results?.length === 0">
        <AudiusTrending type="playlists" title="Trending Playlists" @select="viewPlaylist" />
        <AudiusTrending type="tracks" title="Trending Tracks" @select="playTrack" />
      </Column>
    </Transition>
  </View>
</template>

<script setup lang="ts">
import {
  View,
  AudiusSearch,
  Column,
  AudiusFeatured,
  AudiusTrending,
  useAudius,
  useRouter,
  useQueue,
  useSources,
  adaptTrack
} from "@wearesage/vue";
import { AudioSource } from "@wearesage/shared";

const audius = useAudius();
const router = useRouter();
const queue = useQueue();
const sources = useSources();

function viewPlaylist({ id }: { id: string }) {
  router.push(`/audius/playlists/${id}`);
}

async function playTrack(track: any) {
  const universalTrack = adaptTrack(track, AudioSource.AUDIUS);

  if (!universalTrack) return;

  if (sources.source !== AudioSource.AUDIUS) {
    await sources.selectSource(AudioSource.AUDIUS);
  }

  queue.setQueue([universalTrack], 0);

  if (!queue.queue.isPlaying) {
    queue.togglePlayPause();
  }

  router.push("/visualizer");
}

audius.fetchTrending();
</script>

<route lang="json">
{
  "name": "Audius Home",
  "meta": {
    "description": "audius library dashboard",
    "requiresAuth": true
  }
}
</route>

<style lang="scss" scoped>
main {
  @include size(100vw, 100vh);
  @include hide-scroll-bar;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
