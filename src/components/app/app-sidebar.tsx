import { Download, Film, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FILE_INPUT_ACCEPT } from "@/lib/file-acceptance";

interface AppSidebarProps {
  imagesCount: number;
  maxFrames: number;
  outputFileName: string;
  onOutputFileNameChange: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPickFiles: () => void;
  onExport: () => void;
  canExport: boolean;
  isGenerating: boolean;
}

export function AppSidebar({
  imagesCount,
  maxFrames,
  outputFileName,
  onOutputFileNameChange,
  fileInputRef,
  onFileInputChange,
  onPickFiles,
  onExport,
  canExport,
  isGenerating,
}: AppSidebarProps) {
  return (
    <aside className="flex h-full w-70 min-w-70 flex-col border-r border-[#333] bg-[#232323]">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Film className="h-5 w-5 text-white opacity-80" />
        <span className="text-[15px] font-semibold tracking-tight">negadice</span>
      </div>

      <Separator className="bg-[#333]" />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] tracking-widest text-[#888] uppercase">ソースファイル</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_INPUT_ACCEPT}
            multiple
            className="hidden"
            onChange={onFileInputChange}
          />
          <Button
            variant="outline"
            className="w-full gap-2 border-[#444] bg-[#2a2a2a] text-white hover:bg-[#333] hover:text-white"
            onClick={onPickFiles}
          >
            <Upload className="h-4 w-4" />
            写真を選択
          </Button>
          {imagesCount > 0 && (
            <span className="text-[12px] text-[#888]">
              {imagesCount} / {maxFrames} frames
            </span>
          )}
        </div>

        <Separator className="bg-[#333]" />

        <div className="flex flex-col gap-4">
          <span className="text-[11px] tracking-widest text-[#888] uppercase">書き出し設定</span>

          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-[#aaa]">形式</span>
            <Select defaultValue="jpeg" disabled>
              <SelectTrigger className="border-[#444] bg-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="output-file-name" className="text-[12px] text-[#aaa]">
              ファイル名
            </label>
            <input
              id="output-file-name"
              value={outputFileName}
              onChange={(event) => onOutputFileNameChange(event.target.value)}
              placeholder="index_sheet"
              className="h-8 rounded-md border border-[#444] bg-[#2a2a2a] px-2.5 text-[12px] text-white outline-none placeholder:text-[#666] focus:border-[#777]"
            />
            <span className="text-[11px] text-[#666]">拡張子 .jpg は自動で追加されます</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#333] px-5 py-5">
        <Button
          className="w-full gap-2 bg-white font-medium text-black hover:bg-gray-100"
          onClick={onExport}
          disabled={!canExport}
        >
          <Download className="h-4 w-4" />
          {isGenerating ? "生成中..." : "書き出す"}
        </Button>
      </div>
    </aside>
  );
}
