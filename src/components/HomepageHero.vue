<template>
  <Transition name="fade">
    <Row gap="0.5" v-if="!toast.visible" class="active-users" align="center" justify="center">
      <i class="dot"></i>
      <span>{{ globalUsers.totalUsers }} people seeing the music <strong>right now</strong></span>
    </Row>
  </Transition>

  <Column class="hero" align="start" :padding="device.isMobile ? '1 1 1 1' : '1 1 1 5'" gap="1" justify="center">
    <Row align="start" justify="start" is="h1">
      <span>what</span>
      <div ref="div" :class="{ empty: visible.length === 0 }">{{ visible }}<i :class="{ blink }">&nbsp;</i></div>
      <span><strong>LOOKS like</strong> </span>
    </Row>

    <Column gap="1" v-if="!auth.isAuthenticated">
      <Button @click="auth.signIn" :disabled="auth.isAuthenticating">
        {{ auth.isAuthenticating ? "SIGNING IN..." : "SIGN IN" }}
      </Button>
    </Column>
  </Column>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import {
  Column,
  Row,
  Button,
  pause,
  randomNumber,
  useViewport,
  useAnimation,
  useAuth,
  useToast,
  useGlobalActiveUsers,
  useDevice
} from "@wearesage/vue";

const device = useDevice();
const viewport = useViewport();
const auth = useAuth();
const toast = useToast();
const globalUsers = useGlobalActiveUsers();
const typed = ref(["Spotify", "Audius", "Radio Paradise", "your voice"]);
const activeIndex = ref(0);
const visible = ref("");
const blink = ref(false);
const currentWord = computed(() => typed.value[activeIndex.value]);

let isAnimating = ref(true);

let interval: any;

function initBlink() {
  interval = setInterval(() => {
    blink.value = !blink.value;
  }, 400);
}

async function typeWord() {
  clearInterval(interval);
  blink.value = false;
  const word = currentWord.value;
  for (let i = 0; i <= word.length; i++) {
    if (!isAnimating.value) return;
    visible.value = word.substring(0, i);
    await pause(randomNumber(60, 140));
  }
  initBlink();
}

async function backspaceWord() {
  clearInterval(interval);
  blink.value = false;
  const word = visible.value;
  for (let i = word.length; i >= 0; i--) {
    if (!isAnimating.value) return;
    visible.value = word.substring(0, i);
    await pause(randomNumber(30, 120));
  }
  initBlink();
}

async function animateWords() {
  while (isAnimating.value) {
    await typeWord();
    await pause(3000);
    await backspaceWord();
    activeIndex.value = (activeIndex.value + 1) % typed.value.length;
    await pause(800);
  }
}

onMounted(() => {
  animateWords();
});

onBeforeUnmount(() => {
  clearInterval(interval);
});

onUnmounted(() => {
  isAnimating.value = false;
});

useAnimation(() => {
  viewport.onScroll(0.5);
});
</script>

<style lang="scss" scoped>
.hero {
  @include size(100vw, 100vh);
  position: relative;
  z-index: 1;
  * {
    position: relative;
  }
}

h1 {
  width: 100% !important;
  font-size: 3rem;
  line-height: 1.25;
  border-radius: 5rem;

  div {
    // font-size: 7rem;
    // letter-spacing: -0.5rem;
    // height: 8.75rem;
    padding: 0 0.5rem;
    transition: $transition;
  }
}

strong,
span {
  color: rgba($white, 0.5);
  text-transform: lowercase;
}

i {
  @include size(0.25rem, 100%);
  background: $pink;
  display: inline-flex;

  &.blink {
    background-color: transparent;
  }
}

button {
  @include box(1 1.5);
  background: $pink;
  border-radius: 3rem;
  font-size: 1.5rem;
  border: 1px solid $pink;
  font-family: var(--display);
  transition: var(--hover-transition);
}

button:hover {
  color: $white;
}

.active-users {
  @include position(fixed, 0 0 null 0, 50);
  width: 100%;
  font-size: 0.9rem;
  color: rgba($white, 0.7);
  margin-top: 1rem;

  .dot {
    @include size(0.5rem, 0.5rem);
    transform-origin: center center;
    background: #22c55e; // green dot
    border-radius: 50%;
    animation: pulse 3s infinite ease-in-out;
  }

  span {
    padding: 0.5rem 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
}

h1 {
  @include mobile {
    font-size: 1.5rem;

    div {
      font-size: 2rem;
      letter-spacing: 0;
      height: 3rem;
    }
  }
}
</style>
