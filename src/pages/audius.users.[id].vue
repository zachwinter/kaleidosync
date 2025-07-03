<template>
  <View>
    <Row v-if="user" width="100%" cascade>
      <AudiusUserInfo :user="user" />
      <Column :padding="3" :gap="3" width="100%" cascade>
        <Tabs @select="selectTab" :active="activeTab" :value="tabs" />
        <AudiusTrackList v-if="activeTab === 'Tracks'" :tracks="user.tracks" />
        <AudiusPlaylists v-if="activeTab === 'Playlists'" :playlists="user.playlists" @select="viewPlaylist" />
        <AudiusPlaylists v-if="activeTab === 'Albums'" :playlists="user.albums" @select="viewPlaylist" item="albums" />
      </Column>
    </Row>
  </View>
</template>

<script setup lang="ts">
import {
  View,
  Row,
  Column,
  Tabs,
  AudiusUserInfo,
  AudiusTrackList,
  AudiusPlaylists,
  useGetAudiusUserByHandle,
  useRouteParamId,
  useTabs,
  useRouter
} from "@wearesage/vue";

const router = useRouter();
const user = useGetAudiusUserByHandle(useRouteParamId());
const { tabs, activeTab, selectTab } = useTabs(["Tracks", "Playlists", "Albums"]);

function viewPlaylist({ id }: { id: string }) {
  router.push(`/audius/playlists/${id}`);
}
</script>

<route lang="json">
{
  "name": "Audius User Detail",
  "meta": {
    "description": "view an Audius user",
    "requiresAuth": true
  }
}
</route>

<style lang="scss" scoped>
main {
  height: 100vh;
  overflow-y: auto;
}
</style>
