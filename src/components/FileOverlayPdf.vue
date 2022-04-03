<script setup lang="ts">
import { computed, watch } from 'vue';
import { activeEntry } from '@/features/useDir';

const src = computed(
  () => activeEntry.value?.type === 'pdf' && URL.createObjectURL(activeEntry.value.file)
);

watch(src, (_, oldSrc) => {
  if (oldSrc && oldSrc.startsWith('blob:')) {
    URL.revokeObjectURL(oldSrc);
  }
});
</script>

<template>
  <div
    class="fixed inset-10 overflow-auto whitespace-pre rounded-lg bg-slate-900 font-mono shadow-2xl"
  >
    <embed v-if="src" :src="src" class="h-full w-full" @click.stop />
  </div>
</template>
