
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FileUploadButtonProps {
  onFileSelected: (file: File) => void;
}

const FileUploadButton = ({ onFileSelected }: FileUploadButtonProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="px-2 py-2 text-xs"
        onClick={() => fileInputRef.current?.click()}
      >
        <Plus className="h-4 w-4 mr-2" />
        File
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="*"
        style={{ display: "none" }}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            onFileSelected(e.target.files[0]);
          }
        }}
      />
    </>
  );
};

export default FileUploadButton;
