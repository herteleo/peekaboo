import { computed, reactive, ref, type Ref } from 'vue';
import type { CurrentDirEntry } from '@/features/useDir';

const showFilter = ref(false);

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const stringFilter = ref('');

const tagFilter = reactive<Record<'include' | 'exclude', Array<string>>>({
  include: [],
  exclude: [],
});

const isTagFilterActive = computed(() => tagFilter.include.length || tagFilter.exclude.length);

const isTagInFilter = (tag: string, mode: keyof typeof tagFilter) => tagFilter[mode].includes(tag);

const removeTag = (tag: string, mode: keyof typeof tagFilter) => {
  tagFilter[mode] = tagFilter[mode].filter((t) => t !== tag);
};

const toggleTag = (tag: string, mode: keyof typeof tagFilter) => {
  if (isTagInFilter(tag, mode)) {
    removeTag(tag, mode);
    return;
  }

  if (mode === 'exclude' && isTagInFilter(tag, 'include')) removeTag(tag, 'include');
  if (mode === 'include' && isTagInFilter(tag, 'exclude')) removeTag(tag, 'exclude');

  tagFilter[mode].push(tag);
};

const isUntaggedActive = ref(false);

const toggleUntagged = () => {
  isUntaggedActive.value = !isUntaggedActive.value;
};

const resetTagFilter = () => {
  tagFilter.include = [];
  tagFilter.exclude = [];
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

    return [...new Set([...tags, ...tagFilter.include, ...tagFilter.exclude].sort())];
  });

  const filteredDirEntries = computed(() => {
    const string = stringFilter.value.toLowerCase();

    if (!showFilter.value) return dirEntries.value;

    return dirEntries.value.filter(({ displayName, tags }) => {
      const hasMatchingString = displayName.toLowerCase().includes(string);
      let hasMatchingTags = false;
      let show = hasMatchingString;

      if (hasMatchingString && isTagFilterActive.value) {
        hasMatchingTags =
          tagFilter.include.every((t) => tags.includes(t)) &&
          !tagFilter.exclude.some((t) => tags.includes(t));
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
    isTagFilterActive,
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
