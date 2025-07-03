<template>
  <View>
    <Column v-if="playlist" width="100vw" cascade>
      <Record :src="playlist.artwork?.['1000x1000']" size="120vh" />
      <AudiusPlaylistBody 
        :playlist="playlist"
        @play-playlist="handlePlayPlaylist"
        @play-track="handlePlayTrack"
      />
    </Column>
  </View>
</template>

<script setup lang="ts">
import { View, Column, Record, AudiusPlaylistBody, useRouteParamId, useGetAudiusPlaylistById, useQueue, useSources, useRouter, adaptTrack } from "@wearesage/vue";
import { AudioSource } from "@wearesage/shared";
import type { QueueTrack } from "@wearesage/vue";

const id = useRouteParamId();
const playlist = useGetAudiusPlaylistById(id);
const queue = useQueue();
const sources = useSources();
const router = useRouter();

/**
 * Convert adapted track to queue format
 */
function toQueueTrack(universalTrack: any): QueueTrack {
  return {
    id: universalTrack.id,
    source: universalTrack.source,
    sourceId: universalTrack.sourceId,
    title: universalTrack.title,
    artist: universalTrack.artist,
    album: universalTrack.album,
    duration: universalTrack.duration,
    artwork: universalTrack.artwork,
    rawData: universalTrack.rawData,
  };
}

async function handlePlayPlaylist(playlist: any) {
  if (!playlist.tracks || playlist.tracks.length === 0) {
    console.warn('Playlist has no tracks');
    return;
  }

  console.log('🎵 Playing Audius playlist:', playlist.playlist_name, `(${playlist.tracks.length} tracks)`);
  
  // Convert all tracks to queue format
  const queueTracks: QueueTrack[] = playlist.tracks
    .map((track: any) => adaptTrack(track, AudioSource.AUDIUS))
    .filter((track: any): track is any => track !== null)
    .map((track: any) => toQueueTrack(track));
  
  if (queueTracks.length === 0) {
    console.error('No valid tracks found in playlist');
    return;
  }
  
  // Ensure Audius is selected as the source FIRST (this will clear old queue)
  if (sources.source !== AudioSource.AUDIUS) {
    await sources.selectSource(AudioSource.AUDIUS);
  }
  
  // THEN set the queue with all tracks
  queue.setQueue(queueTracks, 0);
  
  // Start playback
  if (!queue.queue.isPlaying) {
    queue.togglePlayPause();
  }
  
  router.push('/visualizer');
}

async function handlePlayTrack(track: any, index: number) {
  const universalTrack = adaptTrack(track, AudioSource.AUDIUS);
  if (!universalTrack) return;
  
  // Switch source FIRST (this will clear the old queue)
  if (sources.source !== AudioSource.AUDIUS) {
    await sources.selectSource(AudioSource.AUDIUS);
  }
  
  // THEN set the new track in the queue
  const queueTrack = toQueueTrack(universalTrack);
  queue.setQueue([queueTrack], 0);
  
  if (!queue.queue.isPlaying) {
    queue.togglePlayPause();
  }
  router.push('/visualizer');
}
</script>

<style lang="scss" scoped>
.record {
  transform: translateY(-15vh) !important;
}

main {
  height: 100vh;
  overflow-y: auto;
}
</style>

<route lang="json">
{
  "name": "Audius Playlist Detail",
  "meta": {
    "description": "view an Audius playlist",
    "requiresAuth": true
  }
}
</route>
