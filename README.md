# Film Index Sheet Generator (Tauri + React)

A desktop **index-sheet mock app** that arranges your photos into a film-style contact sheet and exports a high-quality JPEG.

Built with **Tauri v2 + React + TypeScript**.

---

## Overview

This project generates a fixed-size film index sheet from selected images:

- Output size: **1500 × 1051 px**
- Layout: **7 columns × 6 rows** (up to **42 frames**)
- White background with frame numbers (`01`, `02`, …)
- Export as JPEG with adjustable quality

This is an **AI-generated app** (developed with AI assistance and human guidance).

---

## Features

- Select multiple images from your computer
- Supports common image formats (JPEG/PNG; TIFF support may vary by environment)
- Sorts photos by **EXIF `DateTimeOriginal`** when available
- Falls back to filename order if EXIF date is missing
- Rotates portrait images to better match index-sheet orientation
- Uses Canvas-based crop/fit rendering for uniform frame filling
- Exports a final JPEG to a folder you choose

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Desktop:** Tauri v2
- **Backend command layer:** Rust
- **Metadata parsing:** `exifr`
- **Rendering:** HTML Canvas API

---

## Requirements

To build and run this app locally, you need:

- **Node.js** (LTS recommended)
- **pnpm**
- **Rust compiler/toolchain** (required for Tauri apps)
- OS-specific prerequisites for Tauri (WebView/runtime dependencies)

> Rust is required because Tauri’s native backend and desktop packaging are Rust-based.

---

## Getting Started

1. Install dependencies:
   - `pnpm install`

2. Run in development mode:
   - `pnpm tauri dev`

3. Build a production app:
   - `pnpm tauri build`

---

## Usage

1. Launch the app
2. Choose your source images (up to 42 per sheet)
3. Adjust JPEG quality
4. Export the generated index sheet
5. Find the saved JPEG in your selected destination folder

---

## Notes / Limitations

- TIFF decoding can vary depending on runtime support.
- Current implementation is fixed to one sheet of 42 frames.
- Image processing (rotation, cropping, numbering, composition) is done client-side with Canvas.

---

## License

This project is licensed under the **MIT License**.

See the [`LICENSE`](./LICENSE) file for full text.

---

## Publishing Info

If you publish this project on GitHub, including this README and a `LICENSE` file is the correct minimum setup for a cloneable and legally reusable open-source repository.
