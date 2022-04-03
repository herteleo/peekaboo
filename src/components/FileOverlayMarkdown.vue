<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { marked } from 'marked';
import { activeEntry } from '@/features/useDir';

const content = ref('');

const src = computed(() => activeEntry.value?.type === 'markdown' && activeEntry.value.file);
watch(
  src,
  async (file) => {
    if (!file) return;
    content.value = marked.parse(await file.text(), { headerIds: false });
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-html="content"
    class="prose prose-invert m-8 max-h-full w-full max-w-screen-md overflow-auto bg-slate-900 p-8 shadow-2xl prose-a:text-teal-600 prose-pre:bg-black prose-img:rounded"
    @click.stop
  />
</template>
