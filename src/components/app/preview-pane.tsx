import { Upload } from "lucide-react";

import { COLS, ROWS, SHEET_HEIGHT, SHEET_WIDTH } from "@/lib/canvas";
import { type ImageFile } from "@/lib/exif";

interface PreviewPaneProps {
  images: ImageFile[];
  isDraggingOver: boolean;
  onPickFiles: () => void;
}

export function PreviewPane({ images, isDraggingOver, onPickFiles }: PreviewPaneProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#333] px-6 py-3">
        <span className="text-[11px] tracking-wider text-[#666] uppercase">
          PREVIEW - {COLS} x {ROWS} grid
        </span>
        <span className="text-[11px] tracking-wider text-[#666]">
          JPEG - {SHEET_WIDTH}x{SHEET_HEIGHT}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {images.length === 0 ? (
          <div
            className={`flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${isDraggingOver ? "border-white/40 bg-white/5" : "border-[#444]"}`}
            onClick={onPickFiles}
          >
            <Upload className="mb-3 h-10 w-10 text-[#555]" />
            <p className="text-sm text-[#555]">写真をドラッグ&ドロップ、またはクリックして選択</p>
            <p className="mt-1 text-xs text-[#444]">JPEG / PNG - 最大42枚</p>
          </div>
        ) : (
          <div
            className={`grid w-full gap-1 ${isDraggingOver ? "opacity-50" : ""}`}
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
          >
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-3/2 overflow-hidden rounded-sm bg-[#333]"
              >
                <img src={img.url} alt={img.fileName} className="h-full w-full object-cover" />
                <div className="absolute right-0.5 bottom-0.5 rounded-[1px] bg-white/90 px-1 text-[9px] leading-4 font-bold text-black">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
