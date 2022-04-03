<script setup lang="ts">
import { computed, watch } from 'vue';
import { activeEntry } from '@/features/useDir';

const src = computed(
  () => activeEntry.value?.type === 'audio' && URL.createObjectURL(activeEntry.value.file)
);

watch(src, (_, oldSrc) => {
  if (oldSrc && oldSrc.startsWith('blob:')) {
    URL.revokeObjectURL(oldSrc);
  }
});
</script>

<template>
  <audio v-if="src" :src="src" class="shadow-2xl" @click.stop controls autoplay />
</template>
