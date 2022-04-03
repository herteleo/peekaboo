<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { activeEntry } from '@/features/useDir';

const content = ref('');

const src = computed(() => activeEntry.value?.type === 'text' && activeEntry.value.file);
watch(
  src,
  async (file) => {
    if (!file) return;
    content.value = hljs.highlightAuto(await file.text()).value;
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-html="content"
    class="m-8 max-h-full w-full max-w-screen-lg overflow-auto whitespace-pre bg-slate-900 p-8 font-mono shadow-2xl"
    @click.stop
  />
</template>
