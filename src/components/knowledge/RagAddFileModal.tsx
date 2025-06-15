
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RagAddFileModalProps {
  open: boolean;
  onClose: () => void;
  onAddFile: (file: { name: string; type: string; indexed: boolean }) => void;
}

const FILE_TYPE_OPTIONS = [
  "pdf", "docx", "xlsx", "txt", "csv", "pptx", "md", "json", "ragdata", "zip"
];

const RagAddFileModal: React.FC<RagAddFileModalProps> = ({ open, onClose, onAddFile }) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [indexed, setIndexed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim() === "" || fileType === "") return;
    onAddFile({ name: fileName, type: fileType, indexed });
    setFileName("");
    setFileType("");
    setIndexed(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add New File (Demo)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <Input
            required
            placeholder="File name (e.g. My_Policy.pdf)"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            className="bg-cyber-gunmetal border-cyber-gunmetal text-white"
          />
          <select
            className="rounded-md p-2 bg-cyber-gunmetal border-cyber-gunmetal text-white"
            value={fileType}
            required
            onChange={e => setFileType(e.target.value)}
          >
            <option value="">File type</option>
            {FILE_TYPE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.toUpperCase()}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 mt-1 ml-1">
            <input
              id="indexed"
              type="checkbox"
              checked={indexed}
              onChange={e => setIndexed(e.target.checked)}
              className="mr-1 rounded accent-cyber-red"
            />
            <label htmlFor="indexed" className="text-sm text-white cursor-pointer">Indexed</label>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-cyber-red text-white hover:bg-cyber-red-dark w-full">Add File</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RagAddFileModal;

