<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { defineAsyncComponent, onBeforeUnmount, ref } from 'vue';
import type { CurrentDirEntryFile } from '@/features/useDir';
import { activateEntryRelativeToActive, activeEntry } from '@/features/useDir';

const components: Record<CurrentDirEntryFile['type'], any> = {
  audio: defineAsyncComponent(() => import('./FileOverlayAudio.vue')),
  image: defineAsyncComponent(() => import('./FileOverlayImage.vue')),
  markdown: defineAsyncComponent(() => import('./FileOverlayMarkdown.vue')),
  pdf: defineAsyncComponent(() => import('./FileOverlayPdf.vue')),
  text: defineAsyncComponent(() => import('./FileOverlayText.vue')),
  unknown: defineAsyncComponent(() => import('./FileOverlayUnknown.vue')),
  video: defineAsyncComponent(() => import('./FileOverlayVideo.vue')),
};

const deactivate = () => {
  if (!activeEntry.value) return;
  activeEntry.value.isActive = false;
};

const hasArrowFocus = ref(false);
const showArrows = ref(false);

let mouseMoveTimer: any = 0;
const hideArrows = () => {
  showArrows.value = false;
};

const onMouseMove = () => {
  showArrows.value = true;

  clearTimeout(mouseMoveTimer);
  mouseMoveTimer = setTimeout(hideArrows, 1000);
};

onKeyStroke(['w', 'ArrowUp'], (event) => {
  if (!activeEntry.value) return;
  event.preventDefault();
  activateEntryRelativeToActive(-5);
});

onKeyStroke(['d', 'ArrowRight'], (event) => {
  if (!activeEntry.value) return;
  event.preventDefault();
  activateEntryRelativeToActive(1);
});

onKeyStroke(['s', 'ArrowDown'], (event) => {
  if (!activeEntry.value) return;
  event.preventDefault();
  activateEntryRelativeToActive(5);
});

onKeyStroke(['a', 'ArrowLeft'], (event) => {
  if (!activeEntry.value) return;
  event.preventDefault();
  activateEntryRelativeToActive(-1);
});

const onMouseUp = (event: MouseEvent) => {
  if (!activeEntry.value) return;

  if (event.button === 4) {
    event.preventDefault();
    activateEntryRelativeToActive(1);
  }

  if (event.button === 3) {
    event.preventDefault();
    activateEntryRelativeToActive(-1);
  }
};

document.addEventListener('mouseup', onMouseUp);

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div
    v-if="activeEntry?.isFile"
    class="fixed inset-0 grid place-items-center bg-black/50 backdrop-blur-lg"
    @click="deactivate"
    @mousemove="onMouseMove"
  >
    <component :is="components[activeEntry.type]" />

    <button
      v-show="showArrows || hasArrowFocus"
      class="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-l-full bg-black/10 text-white/75 backdrop-blur-sm hover:bg-black/20"
      @click.stop="activateEntryRelativeToActive(1)"
      @mouseenter="hasArrowFocus = true"
      @mouseleave="hasArrowFocus = false"
    >
      <app-icon name="NavArrowRight" size="64" class="drop-shadow" />
    </button>
    <button
      v-show="showArrows || hasArrowFocus"
      class="absolute left-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-r-full bg-black/10 text-white/75 backdrop-blur-sm hover:bg-black/20"
      @click.stop="activateEntryRelativeToActive(-1)"
      @mouseenter="hasArrowFocus = true"
      @mouseleave="hasArrowFocus = false"
    >
      <app-icon name="NavArrowLeft" size="64" class="drop-shadow" />
    </button>
  </div>
</template>
