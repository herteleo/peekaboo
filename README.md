# Peekaboo - The Local File Explorer

Open a local folder and explore your files inside the browser. Your files stay private and won't be uploaded anywhere.

## Scope

- Explore your local files inside the browser.
- Play web-ready audio and video files.
- Browse and present your images.
- Display parsed Markdown files.
- Inspect text based documents with syntax highlighting for several languages.
- View PDF files.

## Features

- Install Peekaboo as PWA. It works offline too.
- Add a `README.md` file to display its contents above the listed directory entries.
- Filter current directory entries by search term.
- Filter files and folders in current directory by tag. Add tags (comma separated) in square brackets at the end of the file or folder name. Examples:
  ```
  Wallpapers [Dark, Space]
  Wallpapers [Abstract, Dark]
  IMG001 [2021, Berlin].jpg
  IMG002 [2022, New York].jpg
  ```
  Right-click tags in filter to exclude entries with the respective tag from the list.
- Place an image file named like the folder to define a permanent cover/thumbnail. Example:
  - Folder name: `Wallpapers`
  - Image inside folder: `Wallpapers.jpg`

---

This is mainly a fun and research project regarding the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) and other technics. Plus the weird urge to build a file explorer for the browser. Because why not.
