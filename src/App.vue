<script setup lang="ts">
import FileOverlay from '@/components/FileOverlay.vue';
import ReloadPrompt from '@/components/ReloadPrompt.vue';
</script>

<template>
  <router-view />
  <file-overlay />
  <reload-prompt />
</template>

<style lang="postcss">
:root {
  color-scheme: dark;
}

@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
