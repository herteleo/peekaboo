<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import type { CurrentDirEntry } from '@/features/useDir';
import { getDirCoverEntry, getFirstImageEntry, setupDirEntries } from '@/features/useDir';
import CanvasThumb from '@/components/CanvasThumb.vue';

const props = defineProps<{
  entry: CurrentDirEntry;
}>();

const thumb = ref('');

const isInView = ref(false);
const isOrWasInView = ref(false);

const refWrap = ref<HTMLElement | null>(null);
useIntersectionObserver(refWrap, ([{ isIntersecting }]) => {
  isInView.value = isIntersecting;
  if (isIntersecting && !isOrWasInView.value) {
    isOrWasInView.value = true;

    if (props.entry.type === 'image') {
      setFileAsImage(props.entry.file);
    } else {
      getDirPreview();
    }
  }
});

const setFileAsImage = (file: File) => {
  thumb.value = URL.createObjectURL(file);
};

const getDirPreview = async () => {
  if (!props.entry.isDir) return;

  const entries = await setupDirEntries(props.entry.handle);

  const coverEntry = getDirCoverEntry(entries, props.entry.handle.name);
  if (coverEntry?.isFile) return setFileAsImage(coverEntry.file);

  const firstImage = getFirstImageEntry(entries);
  if (firstImage?.isFile) return setFileAsImage(firstImage.file);
};

onBeforeUnmount(() => {
  if (thumb.value.startsWith('blob:')) {
    URL.revokeObjectURL(thumb.value);
  }
});

const route = useRoute();

const targetDir = computed(() => {
  const { name } = props.entry.handle;
  const { path } = route.params;
  return encodeURIComponent(path ? decodeURIComponent(path as string) + '/' + name : name);
});

const router = useRouter();
const handleClick = async () => {
  if (props.entry.isDir) {
    router.push({ name: 'Files', params: { path: targetDir.value } });
    return;
  }

  props.entry.isActive = true;
};

const icon = computed(() => {
  switch (props.entry.type) {
    case 'audio':
      return 'Music1';
    case 'dir':
      return 'Folder';
    case 'image':
      return 'MediaImage';
    case 'markdown':
      return 'TextAlt';
    case 'pdf':
      return 'JournalPage';
    case 'text':
      return 'Page';
    case 'unknown':
      return 'EmptyPage';
    case 'video':
      return 'MediaVideo';
    default:
      return 'EmptyPage';
  }
});
</script>

<template>
  <button
    ref="refWrap"
    class="group flex flex-col items-stretch gap-1 text-left"
    @click="handleClick"
  >
    <div class="flex aspect-square overflow-hidden rounded bg-black/25">
      <canvas-thumb v-if="isOrWasInView && thumb" v-show="isInView" :src="thumb" />
      <app-icon v-else :name="icon" size="48" class="mx-auto self-center text-gray-700" />
    </div>
    <div
      class="truncate rounded bg-gray-800 p-2 text-sm leading-none text-gray-500 group-hover:bg-gray-700/50"
      v-text="entry.displayName"
      :title="entry.handle.name"
    />
  </button>
</template>
