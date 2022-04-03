<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    src?: string;
    size?: number;
  }>(),
  {
    src: '',
    size: 248,
  }
);

const canvasEl = ref<HTMLCanvasElement | null>(null);

const createThumb = () => {
  const { src, size } = props;
  if (!src) return;

  const canvas = canvasEl.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();

  img.onload = () => {
    const { naturalHeight, naturalWidth } = img;

    if (naturalWidth === naturalHeight) {
      canvas.height = size;
      canvas.width = size;
    } else if (naturalWidth > naturalHeight) {
      canvas.height = size;
      canvas.width = size * (naturalWidth / naturalHeight);
    } else if (naturalWidth < naturalHeight) {
      canvas.width = size;
      canvas.height = size * (naturalHeight / naturalWidth);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  img.decoding = 'async';
  img.src = src;
};

watch(() => props.src, createThumb);

onMounted(() => createThumb());
</script>

<template>
  <canvas class="aspect-square object-cover" ref="canvasEl" />
</template>
