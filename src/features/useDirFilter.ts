import { computed, ref, type Ref } from 'vue';
import type { CurrentDirEntry } from '@/features/useDir';

const showFilter = ref(false);

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const stringFilter = ref('');

const tagFilter = ref<Array<string>>([]);

const isTagInFilter = (tag: string) => tagFilter.value.includes(tag);

const toggleTag = (tag: string) => {
  if (isTagInFilter(tag)) {
    tagFilter.value = tagFilter.value.filter((t) => t !== tag);
    return;
  }
  tagFilter.value.push(tag);
};

const isUntaggedActive = ref(false);

const toggleUntagged = () => {
  isUntaggedActive.value = !isUntaggedActive.value;
};

const resetTagFilter = () => {
  tagFilter.value = [];
  isUntaggedActive.value = false;
};

const resetFilter = () => {
  stringFilter.value = '';
  showFilter.value = false;
  resetTagFilter();
};

const matchGetTags = new RegExp(/\[(.*)\](?:\.\w+)?$/);
const matchReplaceTags = new RegExp(/(\s?\[.*\])(?:\.\w+)?$/);

export const getTagsFromString = (string: string) =>
  (string.match(matchGetTags)?.[1] || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .sort();

export const removeTagsFromString = (string: string) => {
  const match = string.match(matchReplaceTags)?.[1];
  return match ? string.replace(match, '').trim() : string;
};

const useDirFilter = (dirEntries: Ref<CurrentDirEntry[]>) => {
  const tagFilterOptions = computed(() => {
    const tags = dirEntries.value
      .map(({ tags }) => tags)
      .flat()
      .sort();

    return [...new Set([...tags, ...tagFilter.value].sort())];
  });

  const filteredDirEntries = computed(() => {
    const string = stringFilter.value.toLowerCase();

    if (!showFilter.value) return dirEntries.value;

    return dirEntries.value.filter(({ displayName, tags }) => {
      const hasMatchingString = displayName.toLowerCase().includes(string);
      let hasMatchingTags = false;
      let show = hasMatchingString;

      if (hasMatchingString && tagFilter.value.length) {
        hasMatchingTags = tagFilter.value.every((t) => tags.includes(t));
        show = hasMatchingTags;
      }

      if (hasMatchingString && isUntaggedActive.value) {
        show = !tags.length || hasMatchingTags;
      }

      return show;
    });
  });

  return {
    showFilter,
    resetFilter,
    toggleFilter,

    filteredDirEntries,

    stringFilter,

    getTagsFromString,
    isTagInFilter,
    isUntaggedActive,
    removeTagsFromString,
    resetTagFilter,
    tagFilter,
    tagFilterOptions,
    toggleTag,
    toggleUntagged,
  };
};

export default useDirFilter;
