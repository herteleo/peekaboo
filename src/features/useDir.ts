import { parse, type Result } from 'ultramatter';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { getTagsFromString, removeTagsFromString } from '@/features/useDirFilter';

interface CurrentDirEntryBase {
  handle: FileSystemHandle;
  displayName: string;
  tags: string[];
  file: false | File;
  isActive: boolean;
  isDir: boolean;
  isFile: boolean;
}

export interface CurrentDirEntryDir extends CurrentDirEntryBase {
  handle: FileSystemDirectoryHandle;
  file: false;
  isDir: true;
  isFile: false;
  type: 'dir';
}

export interface CurrentDirEntryFile extends CurrentDirEntryBase {
  handle: FileSystemFileHandle;
  file: File;
  isDir: false;
  isFile: true;
  type: 'audio' | 'image' | 'markdown' | 'pdf' | 'text' | 'unknown' | 'video';
  mime: string;
}

export const isFileSystemApiAvailable = ref('showDirectoryPicker' in window);

const rootDir = ref<FileSystemDirectoryHandle>();
export const currentDir = ref<FileSystemDirectoryHandle>();

export const setRootDir = async () => {
  if (!isFileSystemApiAvailable.value) return;

  rootDir.value = await window.showDirectoryPicker();
  currentDir.value = rootDir.value;
};

const getFileType = (type: string, name: string): CurrentDirEntryFile['type'] => {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (type === 'application/pdf') return 'pdf';
  if (type.startsWith('video/')) return 'video';
  if (['text/markdown', 'text/x-markdown'].includes(type) || name.endsWith('.md'))
    return 'markdown';
  if (type.startsWith('text/') || type.endsWith('/json') || name.endsWith('.vue')) return 'text';
  return 'unknown';
};

export const getDirCoverEntry = (
  entries: CurrentDirEntry[],
  dirName: string
): CurrentDirEntry | undefined => {
  const cover = entries.find(
    (e) => e.type === 'image' && e.displayName.replace(/\.[^/.]+$/, '') === dirName
  );
  if (cover) return cover;
};

export const getFirstImageEntry = (entries: CurrentDirEntry[]) => {
  return entries.find((e) => e.type === 'image');
};

export type CurrentDirEntry = CurrentDirEntryDir | CurrentDirEntryFile;

export const currentDirEntries = ref<CurrentDirEntry[]>([]);

const currentDirEntriesFiles = computed(() => currentDirEntries.value.filter((e) => e.isFile));

export const currentDirEntriesLoading = ref(false);

export const writeToFileInDir = async (
  directoryHandle: FileSystemDirectoryHandle,
  content: FileSystemWriteChunkType,
  file: { name: string; create?: boolean }
) => {
  const fileHandle = await directoryHandle.getFileHandle(file.name, { create: file.create });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
};

export const resolveReadmeData = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<{ content: string; parsed: Result } | undefined> => {
  try {
    const file = await directoryHandle.getFileHandle('README.md');
    const content = await (await file.getFile()).text();

    return { content, parsed: parse(content) };
  } catch (error) {
    return undefined;
  }
};

export const setupDirEntries = async (dir: FileSystemDirectoryHandle) => {
  const entries: CurrentDirEntry[] = [];

  if (dir) {
    for await (const [, entry] of dir.entries()) {
      if (
        entry.name.startsWith('.') ||
        ['$RECYCLE.BIN', 'System Volume Information'].includes(entry.name)
      )
        continue;

      if (entry.kind === 'file') {
        const file = await entry.getFile();

        // skip files with unknown mime-type
        if (!file.type && !entry.name.endsWith('.md') && !entry.name.endsWith('.vue')) continue;

        entries.push({
          handle: entry,
          file,
          displayName: removeTagsFromString(entry.name),
          tags: getTagsFromString(entry.name),
          type: getFileType(file.type, entry.name),
          mime: file.type,
          isActive: false,
          isDir: false,
          isFile: true,
        });
      } else {
        const { frontmatter = {} } = (await resolveReadmeData(entry))?.parsed || {};
        const { tags } = frontmatter;
        const readmeTags = Array.isArray(tags) ? tags.filter(Boolean).map((t) => String(t)) : [];

        entries.push({
          handle: entry,
          displayName: removeTagsFromString(entry.name),
          tags: [...new Set([...readmeTags, ...getTagsFromString(entry.name)].sort())],
          file: false,
          type: 'dir',
          isActive: false,
          isDir: true,
          isFile: false,
        });
      }
    }
  }

  entries.sort((a, b) => {
    if (a.isDir === b.isDir) return a.handle.name.localeCompare(b.handle.name);
    return a.isDir ? -1 : 1;
  });

  return entries;
};

export const activeEntry = computed(() => {
  return currentDirEntries.value.find((e) => e.isActive);
});

export const activateEntryRelativeToActive = (relativeIndex: number) => {
  const entries = currentDirEntriesFiles.value;
  const activeIndex = entries.findIndex(({ isActive }) => isActive);
  if (activeIndex < 0) return;

  entries[activeIndex].isActive = false;

  if (activeIndex + relativeIndex < 0) {
    entries[entries.length - activeIndex + relativeIndex].isActive = true;
  } else if (entries.length > activeIndex + relativeIndex) {
    entries[activeIndex + relativeIndex].isActive = true;
  } else if (entries.length > relativeIndex) {
    entries[relativeIndex - 1].isActive = true;
  }
};

const loadCurrentDir = async (dir = currentDir.value) => {
  if (!dir) return;

  currentDirEntriesLoading.value = true;
  const entries = await setupDirEntries(dir);
  currentDirEntries.value = [];
  await nextTick();
  currentDirEntries.value = entries;
  currentDirEntriesLoading.value = false;
};

export const reloadCurrentDir = () => {
  loadCurrentDir();
};

const useDir = () => {
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    if (!rootDir.value) {
      router.replace({ name: 'Home' });
    }
  });

  watch(
    () => rootDir.value,
    () => router.push({ name: 'Files' })
  );

  watch(() => currentDir.value, loadCurrentDir);

  watch(
    () => route.params.path,
    async (pathStr) => {
      if (typeof pathStr !== 'string' || !rootDir.value) return;

      const pathParts = decodeURIComponent(pathStr).split('/').filter(Boolean);

      let activeDir = rootDir.value;
      for (const subDirName of pathParts) {
        activeDir = await activeDir.getDirectoryHandle(decodeURIComponent(subDirName));
      }
      currentDir.value = activeDir;
    }
  );

  onBeforeRouteUpdate(() => {
    currentDirEntriesLoading.value = true;
  });
};

export default useDir;
