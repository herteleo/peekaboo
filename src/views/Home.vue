<script lang="ts" setup>
import useDir, { setRootDir } from '@/features/useDir';
import { displayName, version } from '@/../package.json';

useDir();
</script>

<template>
  <div class="grid grow place-items-center">
    <div class="max-w-md space-y-2 p-4 text-center text-gray-400">
      <button @click="setRootDir">
        <div class="space-y-2">
          <app-icon class="mx-auto opacity-60" name="Folder" size="128" />
          <div class="text-xl capitalize">Click to browse your local files in the browser</div>
          <div class="opacity-30">Because why not. Your local files stay private.</div>
        </div>
      </button>
      <div class="text-sm opacity-20">
        {{ displayName }} v{{ version }} &middot;
        <a class="underline" href="https://github.com/herteleo/peekaboo" target="_blank">GitHub</a>
      </div>
    </div>
  </div>
</template>
