<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { displayName } from '@/../package.json';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed right-2 bottom-2 max-w-sm space-y-3 rounded-lg border border-gray-700 bg-gray-800 p-4 text-gray-400 shadow-lg"
    role="alert"
  >
    <div
      class="leading-tight"
      v-text="
        offlineReady
          ? `${displayName} is now offline available.`
          : `A new version of ${displayName} is available.`
      "
    />
    <div class="flex gap-2">
      <button
        v-if="needRefresh"
        class="rounded bg-teal-700 px-2 py-1 font-medium text-teal-200 shadow"
        @click="updateServiceWorker()"
      >
        Reload
      </button>
      <button
        :class="{
          'rounded px-2 py-1 font-medium text-teal-200': true,
          'bg-teal-700 shadow': !needRefresh,
        }"
        @click="close"
      >
        Close
      </button>
    </div>
  </div>
</template>
