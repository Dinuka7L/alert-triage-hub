
import React, { useState } from "react";
import { circleDot, circleX, file, folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// SVG icons by type (fallback to file)
const ICONS: Record<string, React.ReactNode> = {
  pdf: <file className="text-cyber-red" />,
  docx: <file className="text-cyber-red/80" />,
  xlsx: <folder className="text-green-600" />,
  txt: <file className="text-gray-400" />,
  csv: <folder className="text-blue-400" />,
  pptx: <folder className="text-yellow-400" />,
  md: <file className="text-white" />,
  json: <file className="text-cyber-red/60" />,
  ragdata: <file className="text-cyber-red/80" />,
  zip: <folder className="text-gray-400" />
};

interface RagFileRowProps {
  file: { id: number; name: string; type: string; indexed: boolean };
  enabled: boolean;
  onToggle: () => void;
  onIndex: () => void;
  isIndexed: boolean;
  indexing: boolean;
}

const RagFileRow: React.FC<RagFileRowProps> = ({
  file,
  enabled,
  onToggle,
  onIndex,
  isIndexed,
  indexing
}) => {
  // File friendly extension label
  const ext = file.type.toUpperCase();

  return (
    <tr className={cn(
      enabled ? "" : "opacity-60",
      !isIndexed ? "bg-cyber-gunmetal/30" : ""
    )}>
      <td className="px-4 py-2 flex items-center gap-3 font-medium">
        <span className="flex items-center">
          <span className="mr-2">
            {ICONS[file.type] || <file className="text-gray-300" />}
          </span>
          <span>{file.name}</span>
        </span>
      </td>
      <td className="px-2 py-2 text-xs">{ext}</td>
      <td className="px-2 py-2">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {isIndexed ? (
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_1.5px_#22c55e50]"
                  title="Indexed in KB"
                ></span>
                <span className="sr-only">Indexed</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full bg-red-500 animate-[ping_1.2s_linear_infinite]"
                  title="Not yet indexed"
                ></span>
                <span className="sr-only">Unindexed</span>
              </span>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {isIndexed ? "Indexed in KB" : "Not yet indexed"}
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </td>
      <td className="px-2 py-2 flex items-center gap-2">
        {!isIndexed && (
          <Button
            size="sm"
            className="bg-cyber-red/90 hover:bg-cyber-red"
            onClick={onIndex}
            disabled={indexing}
          >
            {indexing ? "Indexing..." : "Index Now"}
          </Button>
        )}
        <Button
          size="sm"
          variant={enabled ? "secondary" : "outline"}
          className={cn(
            enabled
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-cyber-gunmetal text-gray-400 border-gray-600"
          )}
          onClick={onToggle}
        >
          {enabled ? "On" : "Off"}
        </Button>
      </td>
    </tr>
  );
};

export default RagFileRow;
