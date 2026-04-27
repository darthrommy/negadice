import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { MAX_FRAMES } from "@/lib/canvas";
import { type ImageFile, readImageWithExif, sortImageFiles } from "@/lib/exif";
import { isAcceptedImageFile } from "@/lib/file-acceptance";

export function useImageFiles() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const clearImages = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.url));
      return [];
    });
  }, []);

  const setImagesWithCleanup = useCallback((nextImages: ImageFile[]) => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.url));
      return nextImages;
    });
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((file) => isAcceptedImageFile(file));

      if (fileArray.length === 0) {
        toast.error("対応フォーマット（JPEG/PNG）の画像を選択してください");
        return;
      }

      const imageFiles = await Promise.all(fileArray.map(readImageWithExif));
      const sorted = sortImageFiles(imageFiles);

      if (sorted.length > MAX_FRAMES) {
        toast.warning(`42枚を超える画像は無視されます（${sorted.length - MAX_FRAMES}枚スキップ）`);
      }

      const limited = sorted.slice(0, MAX_FRAMES);
      setImagesWithCleanup(limited);
    },
    [setImagesWithCleanup],
  );

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        void handleFiles(event.target.files);
      }

      // Enable selecting the same files twice in a row.
      event.currentTarget.value = "";
    },
    [handleFiles],
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    images,
    fileInputRef,
    openFilePicker,
    handleFileInput,
    handleFiles,
    clearImages,
  };
}
