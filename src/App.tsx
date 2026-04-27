import { invoke } from "@tauri-apps/api/core";
import { open as dialogOpen } from "@tauri-apps/plugin-dialog";
import { useCallback, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

import { AppSidebar } from "@/components/app/app-sidebar";
import { PreviewPane } from "@/components/app/preview-pane";
import { useFileDropzone } from "@/hooks/use-file-dropzone";
import { useImageFiles } from "@/hooks/use-image-files";
import { generateIndexSheet, canvasToBlob, MAX_FRAMES } from "@/lib/canvas";
import { buildOutputJpegPath, sanitizeOutputFileName } from "@/lib/output";

export default function App() {
  const { images, fileInputRef, openFilePicker, handleFileInput, handleFiles, clearImages } =
    useImageFiles();

  const [isGenerating, setIsGenerating] = useState(false);
  const [outputFileName, setOutputFileName] = useState("index_sheet");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isDraggingOver, dropzoneRef } = useFileDropzone({
    onFilesDropped: handleFiles,
  });

  const handleExport = useCallback(async () => {
    if (images.length === 0) {
      toast.error("書き出す画像がありません");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    try {
      await generateIndexSheet(images, canvas);
      const blob = await canvasToBlob(canvas);

      const folderPath = await dialogOpen({
        directory: true,
        multiple: false,
        title: "保存先フォルダを選択",
      });

      if (!folderPath) {
        setIsGenerating(false);
        return;
      }

      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = Array.from(new Uint8Array(arrayBuffer));

      const safeFileName = sanitizeOutputFileName(outputFileName);
      const filePath = buildOutputJpegPath(folderPath, safeFileName);

      await invoke("save_jpeg", { path: filePath, data: uint8Array });

      toast.success("書き出しが完了しました");

      clearImages();

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } catch (err) {
      console.error(err);
      toast.error(`書き出しに失敗しました: ${String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  }, [images, outputFileName, clearImages]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#1a1a1a] text-white">
      <Toaster position="bottom-right" theme="dark" />

      <AppSidebar
        imagesCount={images.length}
        maxFrames={MAX_FRAMES}
        outputFileName={outputFileName}
        onOutputFileNameChange={setOutputFileName}
        fileInputRef={fileInputRef}
        onFileInputChange={handleFileInput}
        onPickFiles={openFilePicker}
        onExport={() => void handleExport()}
        canExport={!isGenerating && images.length > 0}
        isGenerating={isGenerating}
      />

      <main ref={dropzoneRef} className="flex flex-1 flex-col overflow-hidden">
        <PreviewPane images={images} isDraggingOver={isDraggingOver} onPickFiles={openFilePicker} />
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
