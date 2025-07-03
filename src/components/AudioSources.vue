<template>
  <div>
    <Transition name="fade">
      <nav v-if="radioParadise">
        <MenuHeader title="Choose your station" @close="toggleRadioParadise" />

        <Column cascade gap=".5">
          <button class="rp-btn" @click="selectStation('MAIN_MIX')">
            <img src="/images/radio-paradise/main-mix.jpg" />
          </button>
          <button class="rp-btn" @click="selectStation('MELLOW_MIX')">
            <img src="/images/radio-paradise/mellow-mix.jpg" />
          </button>
          <button class="rp-btn" @click="selectStation('ROCK_MIX')">
            <img src="/images/radio-paradise/rock-mix.jpg" />
          </button>
          <button class="rp-btn" @click="selectStation('GLOBAL_MIX')">
            <img src="/images/radio-paradise/global-mix.jpg" />
          </button>
        </Column>
      </nav>
    </Transition>

    <Transition name="fade">
      <nav v-if="!radioParadise">
        <MenuHeader @close="$emit('close')" title="choose your audio source" />
        <IconButton icon="spotify" @click="$emit('select-source', AudioSource.SPOTIFY)" label="Spotify" />
        <IconButton icon="audius" @click="$emit('select-source', AudioSource.AUDIUS)" label="Audius" />
        <IconButton icon="radio-paradise" @click="toggleRadioParadise" label="Radio Paradise" />
        <IconButton icon="kexp" @click="$emit('select-source', AudioSource.KEXP)" label="KEXP" />
        <IconButton icon="microphone" @click="$emit('select-source', AudioSource.MICROPHONE)" label="Microphone" />

        <span class="file-container">
          <IconButton icon="upload" label="File" />
          <input ref="fileInput" type="file" multiple accept="audio/*" @change="handleFileSelect" />
        </span>
      </nav>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Column, IconButton, useSources } from "@wearesage/vue";
import { AudioSource, RadioParadiseStation } from "@wearesage/shared";
import MenuHeader from "./MenuHeader.vue";

const emit = defineEmits(["select-source", "close", "select-radio-paradise"]);

const radioParadise = ref(false);
const fileInput = ref<HTMLInputElement>();
const sources = useSources();

function toggleRadioParadise() {
  radioParadise.value = !radioParadise.value;
}

function selectStation(station: keyof typeof RadioParadiseStation) {
  const stationValue = RadioParadiseStation[station];
  emit("select-radio-paradise", { station: stationValue });
  radioParadise.value = false; // Close the station selector
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    console.log(`📁 Selected ${files.length} file(s):`);
    for (let i = 0; i < files.length; i++) {
      console.log(`📁 - ${files[i].name} (${files[i].type})`);
    }

    // Select FILE source first, then load files
    await sources.selectSource(AudioSource.FILE);
    await sources.loadFiles(files);
    
    // Close the audio sources menu
    emit("close");
  }

  // Reset the input value so the same file can be selected again
  target.value = "";
}
</script>

<style lang="scss" scoped>
nav {
  @include fixed-menu;
}

.rp-btn {
  @include size(9rem, var(--element-size));
  @include flex(center, center);
  position: relative;
  border-radius: 1.75rem;
  padding-left: 2rem;
  padding-top: 1rem;

  &:hover {
    cursor: pointer;
  }

  background: #000;
  overflow: hidden;

  img {
    @include size(100%, auto);
    z-index: 5;
    position: absolute;
    display: block;
    transform: translateY(10px);
  }

  &.serenity {
    padding: 0;
    img {
      transform: translateY(0px);
    }
  }
}

.stations {
  // mix-blend-mode: exclusion;
}

nav div {
  @include flex-row;
}

.rp-icon {
  @include size(3rem);
}

.file-container {
  @include size(auto, 3rem);

  input {
    @include position(absolute, 0 0 0 0, 10);
    opacity: 0;
  }
}
</style>
