
import React from "react";
import { File, Folder } from "lucide-react";

interface RagSidebarSummaryProps {
  total: number;
  indexed: number;
  unindexed: number;
  thirdParty: number;
}

export default function RagSidebarSummary({
  total,
  indexed,
  unindexed,
  thirdParty
}: RagSidebarSummaryProps) {
  return (
    <div className="rounded-lg bg-cyber-dark border border-cyber-gunmetal py-4 px-6 shadow-lg sticky top-4 w-full">
      <h2 className="text-lg font-bold text-white mb-3 flex gap-2 items-center">
        <File className="h-5 w-5 text-cyber-red" /> Knowledge Base Stats
      </h2>
      <div className="space-y-1">
        <StatRow label="Total Files" value={total} icon={<File className="h-4 w-4 text-white" />} />
        <StatRow label="Indexed" value={indexed} icon={
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2" />} />
        <StatRow label="Unindexed" value={unindexed} icon={
          <span className="inline-block h-3 w-3 rounded-full bg-red-500 animate-[ping_1.2s_linear_infinite] mr-2" />} />
        <StatRow label="3rd Party Sources" value={thirdParty} icon={<Folder className="h-4 w-4 text-blue-400" />} />
      </div>
      <div className="mt-5 text-xs text-gray-400">Stats reflect demo/mock file data</div>
    </div>
  );
}

function StatRow({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span className="w-28">{label}</span>
      <span className="ml-auto font-bold text-white">{value}</span>
    </div>
  );
}
