<script setup lang="ts">
import { marked } from 'marked';
import { computed, ref, watch } from 'vue';
import DirEntry from '@/components/DirEntry.vue';
import useDir, {
  setRootDir,
  currentDir,
  currentDirEntries,
  currentDirEntriesLoading,
  getDirCoverEntry,
  reloadCurrentDir,
} from '@/features/useDir';

useDir();

const readmeEntry = computed(() =>
  currentDirEntries.value.find(
    (e) => e.type === 'markdown' && e.file.name.toLowerCase() === 'readme.md'
  )
);
const readmeContent = ref('');

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`);
  const html = linkRenderer.call(renderer, href, title, text);
  return localLink
    ? html
    : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
};

watch(readmeEntry, async (entry) => {
  if (!entry || !entry.isFile) {
    readmeContent.value = '';
    return;
  }

  readmeContent.value = marked.parse(await entry.file.text(), { headerIds: false, renderer });
});

const dirThumbEntry = computed(() =>
  getDirCoverEntry(currentDirEntries.value, currentDir.value?.name || '')
);
const dirThumbSrc = computed(
  () => dirThumbEntry.value?.isFile && URL.createObjectURL(dirThumbEntry.value.file)
);
</script>

<template>
  <header
    class="sticky top-0 flex items-center justify-between bg-black/75 px-4 py-2 text-gray-400 backdrop-blur"
  >
    <div v-text="currentDir?.name" />
    <div class="flex gap-4">
      <div class="animate-spin" v-if="currentDirEntriesLoading">
        <app-icon class="-scale-x-100" name="AirplaneRotation" />
      </div>
      <button @click="reloadCurrentDir">
        <app-icon name="Refresh" />
      </button>
      <button @click="setRootDir">
        <app-icon name="Folder" />
      </button>
    </div>
  </header>
  <div v-if="!currentDirEntries.length" class="grid grow place-content-center">
    <div class="space-y-2 text-center text-gray-600">
      <app-icon class="mx-auto" name="GlassEmpty" size="96" />
      <div class="text-xl uppercase">Empty</div>
    </div>
  </div>
  <template v-else>
    <div v-if="readmeContent" class="mx-auto w-full max-w-screen-2xl p-4">
      <div class="flex gap-4 rounded bg-gray-800 p-8 shadow-lg">
        <div
          class="prose prose-sm prose-invert max-w-none flex-grow prose-headings:text-teal-100 prose-a:text-teal-600 prose-pre:bg-black prose-img:rounded"
          v-html="readmeContent"
        />
        <div v-if="dirThumbSrc">
          <img
            :src="dirThumbSrc"
            :alt="currentDir?.name"
            class="h-64 w-64 rounded object-cover shadow"
          />
        </div>
      </div>
    </div>
    <div class="mx-auto grid w-full max-w-screen-2xl grid-cols-5 gap-4 p-4">
      <DirEntry v-for="entry in currentDirEntries" :key="entry.handle.name" :entry="entry" />
    </div>
  </template>
</template>
