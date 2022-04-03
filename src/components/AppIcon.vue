<script setup lang="ts">
import { computed } from 'vue';
import * as icons from '@/utils/icons';

const props = withDefaults(
  defineProps<{
    name: string;
    size?: string | number;
  }>(),
  {
    size: 24,
  }
);

const icon = computed(() => (icons as Record<string, unknown>)[props.name]);
</script>

<template>
  <component :is="icon" :height="size" :width="size" />
</template>
