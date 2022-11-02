<script lang="ts" setup>
import useDir, { setRootDir, isFileSystemApiAvailable } from '@/features/useDir';
import { displayName, version } from '@/../package.json';

useDir();
</script>

<template>
  <div class="grid grow place-items-center">
    <div class="max-w-md space-y-2 p-4 text-center text-gray-400">
      <button class="rounded-xl border border-slate-800 p-6 hover:bg-slate-800" @click="setRootDir">
        <div class="space-y-2">
          <app-icon class="mx-auto opacity-60" name="Folder" size="128" />
          <div class="text-xl capitalize">Click to browse your local files</div>
          <div class="opacity-30">Because why not. Your local files stay private.</div>
          <div v-if="!isFileSystemApiAvailable" class="pt-2 text-sm text-amber-600">
            Sadly your browser is not supported.<br />Try the latest Chrome Browser.
          </div>
        </div>
      </button>
      <div class="text-sm opacity-20">
        {{ displayName }} v{{ version }} &middot;
        <a class="underline" href="https://github.com/herteleo/peekaboo" target="_blank">GitHub</a>
      </div>
    </div>
  </div>
</template>
