import { type ImageFile } from "./exif";

export const SHEET_WIDTH = 1500;
export const SHEET_HEIGHT = 1051;
export const COLS = 7;
export const ROWS = 6;
export const MAX_FRAMES = COLS * ROWS; // 42

// Layout constants (in pixels at 1500x1051)
const MARGIN_LEFT = 18;
const MARGIN_RIGHT = 18;
const MARGIN_TOP = 18;
const MARGIN_BOTTOM = 18;
const GAP_H = 4; // horizontal gap between cells
const GAP_V = 4; // vertical gap between cells

const CELL_WIDTH = Math.floor(
  (SHEET_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - GAP_H * (COLS - 1)) / COLS,
);
const CELL_HEIGHT = Math.floor(
  (SHEET_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - GAP_V * (ROWS - 1)) / ROWS,
);

// Frame number label constants
const LABEL_FONT_SIZE = 11;
const LABEL_PADDING_H = 4;
const LABEL_PADDING_V = 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawFrameNumber(
  ctx: CanvasRenderingContext2D,
  frameNum: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const label = String(frameNum).padStart(2, "0");
  ctx.font = `bold ${LABEL_FONT_SIZE}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textBaseline = "bottom";

  const textWidth = ctx.measureText(label).width;
  const boxW = textWidth + LABEL_PADDING_H * 2;
  const boxH = LABEL_FONT_SIZE + LABEL_PADDING_V * 2;

  const boxX = x + w - boxW - 2;
  const boxY = y + h - boxH - 2;

  // White background rectangle
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillRect(boxX, boxY, boxW, boxH);

  // Black text
  ctx.fillStyle = "#000000";
  ctx.fillText(label, boxX + LABEL_PADDING_H, boxY + boxH - LABEL_PADDING_V);
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  isRotated: boolean,
) {
  ctx.save();

  // Clip to cell
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();

  let srcW: number;
  let srcH: number;
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;

  if (isRotated) {
    // Image will be rotated 90°, so effective dimensions are swapped
    srcW = naturalH;
    srcH = naturalW;
  } else {
    srcW = naturalW;
    srcH = naturalH;
  }

  // object-fit: cover calculation
  const scaleX = dw / srcW;
  const scaleY = dh / srcH;
  const scale = Math.max(scaleX, scaleY);

  const scaledW = srcW * scale;
  const scaledH = srcH * scale;

  const offsetX = (dw - scaledW) / 2;
  const offsetY = (dh - scaledH) / 2;

  if (isRotated) {
    // Rotate 90° around center of destination cell
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -scaledH / 2, -scaledW / 2, scaledH, scaledW);
  } else {
    ctx.drawImage(img, dx + offsetX, dy + offsetY, scaledW, scaledH);
  }

  ctx.restore();
}

export async function generateIndexSheet(
  images: ImageFile[],
  canvas: HTMLCanvasElement,
): Promise<void> {
  canvas.width = SHEET_WIDTH;
  canvas.height = SHEET_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SHEET_WIDTH, SHEET_HEIGHT);

  const frames = images.slice(0, MAX_FRAMES);

  for (let i = 0; i < frames.length; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;

    const x = MARGIN_LEFT + col * (CELL_WIDTH + GAP_H);
    const y = MARGIN_TOP + row * (CELL_HEIGHT + GAP_V);

    try {
      const img = await loadImage(frames[i].url);
      const isPortrait = img.naturalHeight > img.naturalWidth;

      drawImageCover(ctx, img, x, y, CELL_WIDTH, CELL_HEIGHT, isPortrait);
    } catch {
      // Draw gray placeholder for failed images
      ctx.fillStyle = "#cccccc";
      ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
    }

    drawFrameNumber(ctx, i + 1, x, y, CELL_WIDTH, CELL_HEIGHT);
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement, quality = 90): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      "image/jpeg",
      quality / 100,
    );
  });
}
