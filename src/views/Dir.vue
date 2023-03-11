<script setup lang="ts">
import { marked } from 'marked';
import { computed, nextTick, ref } from 'vue';
import { useTextareaAutosize, watchTriggerable } from '@vueuse/core';
import DirEntry from '@/components/DirEntry.vue';
import useDir, {
  setRootDir,
  currentDir,
  currentDirEntries,
  currentDirEntriesLoading,
  getDirCoverEntry,
  reloadCurrentDir,
  resolveReadmeData,
  writeToFileInDir,
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
  isTagFilterActive,
  isTagInFilter,
  removeTagsFromString,
  resetTagFilter,
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

const readmeData = ref<Awaited<ReturnType<typeof resolveReadmeData>>>();
const readmeContent = ref('');
const readmeTags = ref<string[]>([]);

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`);
  const html = linkRenderer.call(renderer, href, title, text);
  return localLink
    ? html
    : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
};

const { trigger: triggerCurrentDirWatcher } = watchTriggerable(
  currentDir,
  async (dir) => {
    if (!dir) {
      readmeContent.value = '';
      return;
    }

    readmeData.value = await resolveReadmeData(dir);
    const { content, frontmatter = {} } = readmeData.value?.parsed || {};
    const { tags } = frontmatter;

    readmeContent.value = marked.parse(content || '', { headerIds: false, renderer });
    readmeTags.value = Array.isArray(tags) ? tags.map((t) => String(t)) : [];
  },
  { immediate: true }
);

const dirName = computed(() => removeTagsFromString(currentDir.value?.name || ''));

const dirTags = computed(() => [
  ...new Set([...readmeTags.value, ...getTagsFromString(currentDir.value?.name || '')].sort()),
]);

const dirThumbEntry = computed(() =>
  getDirCoverEntry(currentDirEntries.value, removeTagsFromString(currentDir.value?.name || ''))
);
const dirThumbSrc = computed(
  () => dirThumbEntry.value?.isFile && URL.createObjectURL(dirThumbEntry.value.file)
);

const { textarea: $readmeTextarea, input: readmeInput } = useTextareaAutosize();

const editReadme = ref(false);

const openReadmeEditor = async () => {
  if (!currentDir.value) return;

  const currentReadmeData = await resolveReadmeData(currentDir.value);
  readmeInput.value = currentReadmeData?.content || `---\ntags: []\n---\n# ${dirName.value}`;

  editReadme.value = true;
};

const saveReadme = async () => {
  if (!currentDir.value) return;

  await writeToFileInDir(currentDir.value, readmeInput.value, { name: 'README.md', create: true });

  if (!readmeData.value) {
    reloadCurrentDir();
  }

  triggerCurrentDirWatcher();

  editReadme.value = false;
};
</script>

<template>
  <header class="sticky top-0">
    <div
      class="flex items-center justify-between bg-black/75 px-4 py-1 text-gray-400 backdrop-blur"
    >
      <div class="flex flex-wrap items-center gap-4">
        <span v-text="dirName" />
        <span v-if="dirTags.length" class="text-sm text-slate-600" v-text="dirTags.join(', ')" />
        <button class="flex items-center gap-1 text-sm text-slate-600" @click="openReadmeEditor">
          <app-icon :name="readmeData ? 'EditPencil' : 'AddCircle'" size="18" />
          README.md
        </button>
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
        :class="{
          'bg-amber-700 text-amber-100': isTagInFilter(tag, 'include'),
          'bg-slate-900 text-slate-400 line-through': isTagInFilter(tag, 'exclude'),
          'bg-slate-800 text-slate-400':
            !isTagInFilter(tag, 'include') && !isTagInFilter(tag, 'exclude'),
        }"
        @click="toggleTag(tag, 'include')"
        @contextmenu.prevent="toggleTag(tag, 'exclude')"
        v-text="tag"
      />
      <button
        class="rounded-full border px-2 text-sm"
        :class="
          isUntaggedActive ? 'border-amber-700 text-amber-300' : 'border-slate-800 text-slate-600'
        "
        @click="toggleUntagged()"
        v-text="isTagFilterActive ? '+ Untagged' : 'Untagged'"
      />
      <button
        v-if="isTagFilterActive || isUntaggedActive"
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

  <form
    v-if="editReadme"
    class="fixed inset-0 grid place-items-center bg-black/50 backdrop-blur-lg"
    method="post"
    @submit.prevent="saveReadme"
    @reset.prevent="editReadme = !editReadme"
  >
    <div
      class="flex max-h-full min-h-[60vh] w-full max-w-screen-lg flex-col gap-4 overflow-auto bg-slate-900 p-8 shadow-2xl"
      @click.stop
    >
      <h2>README.md</h2>
      <textarea
        class="w-full grow resize-none rounded bg-black/50 p-4 font-mono focus:outline focus:outline-slate-600"
        ref="$readmeTextarea"
        v-model="readmeInput"
      />
      <div class="flex items-center justify-center gap-8">
        <button
          class="rounded bg-teal-600 px-4 py-1 hover:bg-teal-400 hover:text-teal-900"
          type="submit"
        >
          Save
        </button>
        <button type="reset">Cancel</button>
      </div>
    </div>
  </form>
</template>
