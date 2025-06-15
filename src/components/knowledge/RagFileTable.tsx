
import React from "react";
import RagFileRow from "./RagFileRow";

interface RagFile {
  id: number;
  name: string;
  type: string;
  indexed: boolean;
}

interface RagFileTableProps {
  files: RagFile[];
  enabledFiles: Record<number, boolean>;
  fileIndexed: Record<number, boolean>;
  onToggleFile: (id: number) => void;
  onIndexFile: (id: number) => void;
  loadingIndexIds?: number[];
}

const RagFileTable: React.FC<RagFileTableProps> = ({
  files,
  enabledFiles,
  fileIndexed,
  onToggleFile,
  onIndexFile,
  loadingIndexIds = []
}) => {
  return (
    <div className="overflow-x-auto rounded-md border border-cyber-gunmetal">
      <table className="min-w-full divide-y divide-cyber-gunmetal text-white">
        <thead className="bg-cyber-dark">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold">File Name</th>
            <th className="px-2 py-2 text-xs font-bold">Type</th>
            <th className="px-2 py-2 text-xs font-bold">Status</th>
            <th className="px-2 py-2 text-xs font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-6">No files found.</td>
            </tr>
          ) : (
            files.map(file => (
              <RagFileRow
                key={file.id}
                file={file}
                enabled={enabledFiles[file.id]}
                onToggle={() => onToggleFile(file.id)}
                onIndex={() => onIndexFile(file.id)}
                isIndexed={fileIndexed[file.id]}
                indexing={loadingIndexIds.includes(file.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RagFileTable;
