import { computed, ref, type Ref } from 'vue';
import type { CurrentDirEntry } from '@/features/useDir';

const showFilter = ref(false);
const stringFilter = ref('');

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const resetFilter = () => {
  stringFilter.value = '';
  showFilter.value = false;
};

const useDirFilter = (dirEntries: Ref<CurrentDirEntry[]>) => {
  const filteredDirEntries = computed(() => {
    const string = stringFilter.value.toLowerCase();

    if (!showFilter.value) return dirEntries.value;

    return dirEntries.value.filter(({ handle }) => handle.name.toLowerCase().includes(string));
  });

  return {
    showFilter,
    stringFilter,
    filteredDirEntries,
    resetFilter,
    toggleFilter,
  };
};

export default useDirFilter;
