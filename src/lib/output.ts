// oxlint-disable-next-line no-control-regex this regex is necessary to filter out reserved characters in file names
const RESERVED_CHARS = /[<>:"/\\|?*\u0000-\u001F]/g;
const TRAILING_DOTS_AND_SPACES = /[.\s]+$/g;
const FALLBACK_NAME = "index_sheet";

export function sanitizeOutputFileName(name: string): string {
  const trimmed = name.trim();
  const replaced = trimmed.replace(RESERVED_CHARS, "_").replace(TRAILING_DOTS_AND_SPACES, "");
  return replaced.length > 0 ? replaced : FALLBACK_NAME;
}

export function buildOutputJpegPath(folderPath: string, fileBaseName: string): string {
  const separator = folderPath.includes("\\") ? "\\" : "/";
  return `${folderPath}${separator}${fileBaseName}.jpg`;
}
