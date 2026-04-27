import exifr from "exifr";

export interface ImageFile {
  id: string;
  file: File;
  url: string;
  dateTaken: Date | null;
  fileName: string;
}

export async function readImageWithExif(file: File): Promise<ImageFile> {
  let dateTaken: Date | null = null;

  try {
    const exif = await exifr.parse(file, ["DateTimeOriginal"]);
    if (exif?.DateTimeOriginal) {
      dateTaken = new Date(exif.DateTimeOriginal);
    }
  } catch {
    // silently ignore exif errors
  }

  const url = URL.createObjectURL(file);

  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
    url,
    dateTaken,
    fileName: file.name,
  };
}

export function sortImageFiles(images: ImageFile[]): ImageFile[] {
  return [...images].sort((a, b) => {
    if (a.dateTaken && b.dateTaken) {
      return a.dateTaken.getTime() - b.dateTaken.getTime();
    }
    if (a.dateTaken && !b.dateTaken) return -1;
    if (!a.dateTaken && b.dateTaken) return 1;
    return a.fileName.localeCompare(b.fileName, undefined, { numeric: true });
  });
}
