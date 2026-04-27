export const FILE_INPUT_ACCEPT = ".jpg,.jpeg,.png";

const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export function isAcceptedImageFile(file: File): boolean {
  if (ACCEPTED_MIME_TYPES.has(file.type)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}
