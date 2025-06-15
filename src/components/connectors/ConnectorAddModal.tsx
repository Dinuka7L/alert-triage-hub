
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Folder, GitBranch, Layers, Link2, Zap } from "lucide-react";

const sources = [
  { name: "Dropbox", icon: <Folder className="w-4 h-4 text-blue-400" /> },
  { name: "Trello", icon: <Zap className="w-4 h-4 text-green-400" /> },
  { name: "GitHub", icon: <GitBranch className="w-4 h-4 text-indigo-400" /> },
  { name: "Notion", icon: <Layers className="w-4 h-4 text-purple-400" /> },
  { name: "API Custom Endpoint", icon: <Link2 className="w-4 h-4 text-pink-400" /> },
];

export default function ConnectorAddModal({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg text-blue-700">Choose Data Source</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-3">
          {sources.map(s => (
            <button
              key={s.name}
              className="flex items-center gap-3 text-md bg-blue-100/90 hover:bg-blue-300/50 rounded-lg px-4 py-2 transition text-blue-900 font-semibold border border-blue-200/70"
              onClick={() => {
                alert("Dummy: Chosen " + s.name);
                onOpenChange(false);
              }}
            >
              {s.icon}
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
