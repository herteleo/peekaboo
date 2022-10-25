<script setup lang="ts">
import { marked } from 'marked';
import { computed, nextTick, ref, watch } from 'vue';
import DirEntry from '@/components/DirEntry.vue';
import useDir, {
  setRootDir,
  currentDir,
  currentDirEntries,
  currentDirEntriesLoading,
  getDirCoverEntry,
  reloadCurrentDir,
} from '@/features/useDir';
import useDirFilter from '@/features/useDirFilter';

useDir();

const {
  showFilter,
  resetFilter,
  toggleFilter,

  filteredDirEntries,
  stringFilter,

  getTagsFromString,
  isTagInFilter,
  removeTagsFromString,
  resetTagFilter,
  tagFilter,
  tagFilterOptions,
  toggleTag,
  isUntaggedActive,
  toggleUntagged,
} = useDirFilter(currentDirEntries);

const $stringFilter = ref<HTMLInputElement>();

const toggleFilterHelper = async () => {
  toggleFilter();

  await nextTick();
  $stringFilter.value?.focus();
};

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
  <header class="sticky top-0">
    <div
      class="flex items-center justify-between bg-black/75 px-4 py-1 text-gray-400 backdrop-blur"
    >
      <div class="flex flex-wrap items-baseline gap-4">
        <span v-text="removeTagsFromString(currentDir?.name || '')" />
        <span
          class="text-sm text-slate-600"
          v-text="getTagsFromString(currentDir?.name || '').join(', ')"
        />
      </div>
      <div class="flex gap-2">
        <div class="animate-spin" v-if="currentDirEntriesLoading">
          <app-icon class="-scale-x-100" name="AirplaneRotation" />
        </div>
        <input
          v-if="showFilter"
          ref="$stringFilter"
          v-model="stringFilter"
          class="rounded-full border border-slate-600 bg-transparent px-4 outline-none placeholder:text-slate-700 focus:bg-slate-800 focus:placeholder:text-slate-400"
          type="search"
          placeholder="Filter list&hellip;"
        />
        <button @click="toggleFilterHelper" class="p-1" :class="{ 'text-amber-600': showFilter }">
          <app-icon name="Filter" />
        </button>
        <button class="p-1" @click="reloadCurrentDir">
          <app-icon name="Refresh" />
        </button>
        <button class="p-1" @click="setRootDir">
          <app-icon name="Folder" />
        </button>
      </div>
    </div>
    <div
      v-if="showFilter && tagFilterOptions.length"
      class="flex flex-wrap gap-2 bg-black/50 px-4 py-2 text-gray-400 backdrop-blur"
    >
      <button
        v-for="tag in tagFilterOptions"
        :key="tag"
        class="rounded-full px-2 text-sm"
        :class="isTagInFilter(tag) ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-slate-400'"
        @click="toggleTag(tag)"
        v-text="tag"
      />
      <button
        class="rounded-full border px-2 text-sm"
        :class="
          isUntaggedActive ? 'border-amber-700 text-amber-300' : 'border-slate-800 text-slate-600'
        "
        @click="toggleUntagged()"
        v-text="tagFilter.length ? '+ Untagged' : 'Untagged'"
      />
      <button
        v-if="tagFilter.length || isUntaggedActive"
        class="text-sm text-slate-500"
        @click="resetTagFilter"
      >
        clear
      </button>
    </div>
  </header>
  <div
    v-if="!currentDirEntries.length || !filteredDirEntries.length"
    class="grid grow place-content-center"
  >
    <div
      v-if="!filteredDirEntries.length && currentDirEntries.length"
      class="space-y-4 text-center text-gray-600"
    >
      <app-icon class="mx-auto" name="AreaSearch" size="96" />
      <div class="text-xl font-medium uppercase">No Results</div>
      <button
        class="rounded-full border border-slate-600 px-4 py-1 font-medium"
        @click="resetFilter"
      >
        Reset Filter
      </button>
    </div>
    <div v-else class="space-y-2 text-center text-gray-600">
      <app-icon class="mx-auto" name="GlassEmpty" size="96" />
      <div class="text-xl font-medium uppercase">Empty</div>
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
      <DirEntry v-for="entry in filteredDirEntries" :key="entry.handle.name" :entry="entry" />
    </div>
  </template>
</template>
