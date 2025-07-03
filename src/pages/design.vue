<template>
  <View>
    <Column padding="1" gap="1" is="aside" align="end">
      <MenuHeader title="design" class="header transition" @close="router.push('/visualizer')">
        <IconButton icon="code" :active="showEditor" @click="toggleEditor" />
        <IconButton icon="sliders" :active="showUniforms" @click="toggleUniforms" />
        <IconButton icon="wand" @click="sketches.magicTween(500)" />
      </MenuHeader>

      <Variants>
        <template #right>
          <IconButton v-if="showUniforms" icon="plus" :disabled="sketches.canAddVariant" @click="sketches.addVariant" />
          <IconButton
            v-else
            icon="shuffle"
            :disabled="sketches.sketch?.variants.length === 1"
            :active="sketches.shuffleVariants"
            @click="sketches.toggleShuffleVariants" />
        </template>
      </Variants>

      <Transition name="fade">
        <Uniforms v-if="showUniforms" @focus="onFocus" @blur="onBlur" :focused="focused" :focused-key="focusedKey" />
      </Transition>
    </Column>

    <Transition name="fade">
      <ShaderEditor
        v-if="showEditor"
        v-model="sketches.shader"
        :error="sketches.shaderError"
        :uniform-keys="sketches.uniformKeys"
        @node-click="onEditorNodeClick" />
    </Transition>
  </View>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { MenuHeader } from "../components";
import {
  Column,
  View,
  IconButton,
  useSketches,
  usePopover,
  useToast,
  useRouter,
  isValidGLSLVariableName,
  Variants,
  Uniforms
} from "@wearesage/vue";

// Lazy load the editor - only loads when component is actually rendered
const ShaderEditor = defineAsyncComponent(() => 
  import('@wearesage/editor/vue').then(m => m.ShaderEditor)
);

const toast = useToast();
const popover = usePopover();
const sketches = useSketches();
const router = useRouter();
const { meta } = useMagicKeys();
const focused = ref(false);
const focusedKey = ref<string | null>(null);
const showUniforms = ref(true);
const showEditor = ref(false);

function toggleUniforms() {
  showUniforms.value = !showUniforms.value;
}

function toggleEditor() {
  showEditor.value = !showEditor.value;
}

function onFocus(key: string) {
  focusedKey.value = key;
  focused.value = true;
}

function onBlur() {
  focused.value = false;
  focusedKey.value = null;
}

async function onEditorNodeClick({ value, type, range }: any) {
  if (type === "uniform") return popover.editUniform(value);
  if (!meta.value || type === "number") return;
  const uniformName: string = (await popover.getText("choose uniform name")) as string;
  if (uniformName.length < 3) return toast.error(`Friends don't let friends code golf (2 characters minimum)`);
  if (!isValidGLSLVariableName(uniformName)) return toast.error("Invalid uniform name.");
  sketches.addUniform({ value, type, range, name: uniformName });
  toast.message(`Added uniform \`${uniformName}\``);
}
</script>

<route lang="json">
{
  "name": "Design",
  "meta": {
    "description": "customize your visuals",
    "requiresAuth": true
  }
}
</route>

<style lang="scss" scoped>
aside {
  @include position(fixed, 0 0 0 null, 50);
  @include hide-scroll-bar;
  will-change: transform, opacity;
  transition: var(--transition);
  overflow-y: scroll;
}
</style>
