<template>
  <View>
    <AudiusSearch />

    <Row v-if="audius.query?.length > 2">
      <AudiusTrending type="tracks" title="Trending Tracks" @select="playTrack" />
      <Column v-if="users.length > 0">
        <AudiusTrending :data="users" title="Users" @select="viewPlaylist" />
      </Column>
      <Column v-if="tracks?.length > 0">
        <AudiusTrending :data="tracks" title="Tracks" @select="viewPlaylist" />
      </Column>
      <Column v-if="playlists?.length > 0">
        <AudiusTrending :data="playlists" title="Playlists" @select="viewPlaylist" />
      </Column>
    </Row>

    <Column v-else>
      <AudiusTrending type="playlists" title="Trending Playlists" @select="viewPlaylist" />
      <AudiusTrending type="tracks" title="Trending Tracks" @select="playTrack" />
    </Column>
  </View>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { View, AudiusSearch, Column, Row, AudiusTrending, useAudius, useRouter, useQueue, useSources, adaptTrack } from "@wearesage/vue";
import { AudioSource } from "@wearesage/shared";

const audius = useAudius();
const router = useRouter();
const queue = useQueue();
const sources = useSources();

function viewPlaylist({ id }: { id: string }) {
  router.push(`/audius/playlists/${id}`);
}

const playlists = computed(() => audius.results?.playlists || []);
const users = computed(() => audius.results?.users || []);
const tracks = computed(() => audius.results?.tracks || []);

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
