import { useCallback, useEffect, useRef, useState } from "react";

interface UseFileDropzoneOptions {
  onFilesDropped: (files: FileList) => void | Promise<void>;
}

export function useFileDropzone({ onFilesDropped }: UseFileDropzoneOptions) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dropzoneRef = useRef<HTMLElement | null>(null);
  const dragDepthRef = useRef(0);

  const resetDraggingState = useCallback(() => {
    dragDepthRef.current = 0;
    setIsDraggingOver(false);
  }, []);

  useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (!dropzone) return;

    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragDepthRef.current += 1;
      setIsDraggingOver(true);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
      setIsDraggingOver(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer?.files;
      resetDraggingState();

      if (files && files.length > 0) {
        void onFilesDropped(files);
      }
    };

    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);

    return () => {
      dropzone.removeEventListener("dragenter", handleDragEnter);
      dropzone.removeEventListener("dragover", handleDragOver);
      dropzone.removeEventListener("dragleave", handleDragLeave);
      dropzone.removeEventListener("drop", handleDrop);
    };
  }, [onFilesDropped, resetDraggingState]);

  useEffect(() => {
    const preventBrowserDrop = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleWindowDragEnd = () => {
      resetDraggingState();
    };

    window.addEventListener("dragover", preventBrowserDrop);
    window.addEventListener("drop", preventBrowserDrop);
    window.addEventListener("drop", handleWindowDragEnd);
    window.addEventListener("dragend", handleWindowDragEnd);

    return () => {
      window.removeEventListener("dragover", preventBrowserDrop);
      window.removeEventListener("drop", preventBrowserDrop);
      window.removeEventListener("drop", handleWindowDragEnd);
      window.removeEventListener("dragend", handleWindowDragEnd);
    };
  }, [resetDraggingState]);

  return {
    dropzoneRef,
    isDraggingOver,
  };
}
