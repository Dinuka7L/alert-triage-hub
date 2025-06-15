
import React, { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, File } from "lucide-react";
import RagFileTable from "@/components/knowledge/RagFileTable";
import RagSidebarSummary from "@/components/knowledge/RagSidebarSummary";
import RagFineTunePrompts from "@/components/knowledge/RagFineTunePrompts";
import RagExternalSources from "@/components/knowledge/RagExternalSources";

// Dummy KB file data (20 entries, various extensions/names/indexed state)
const DUMMY_FILES = [
  { id: 1, name: "Customer_Policies_v2.pdf", type: "pdf", indexed: true },
  { id: 2, name: "Incident_Report_2023_Q4.docx", type: "docx", indexed: false },
  { id: 3, name: "Threat_Indicators_List.csv", type: "csv", indexed: true },
  { id: 4, name: "SOC_Shift_Summary_June14.md", type: "md", indexed: true },
  { id: 5, name: "User_Activity_Log.json", type: "json", indexed: false },
  { id: 6, name: "Phishing_Emails_Jan2024.ragdata", type: "ragdata", indexed: false },
  { id: 7, name: "Training_Schedule.xlsx", type: "xlsx", indexed: true },
  { id: 8, name: "Incident_Response_Playbook.pptx", type: "pptx", indexed: true },
  { id: 9, name: "Team_Contacts.txt", type: "txt", indexed: true },
  { id: 10, name: "Logs_Archive_April2024.zip", type: "zip", indexed: false },
  { id: 11, name: "Endpoint_Whitelist.pdf", type: "pdf", indexed: true },
  { id: 12, name: "Malware_Samples_Apr2024.ragdata", type: "ragdata", indexed: false },
  { id: 13, name: "Critical_Alerts_June.md", type: "md", indexed: true },
  { id: 14, name: "SOC_Operations_Plan.docx", type: "docx", indexed: false },
  { id: 15, name: "Backup_Servers_Config.json", type: "json", indexed: false },
  { id: 16, name: "SOC_Metrics_May2024.xlsx", type: "xlsx", indexed: true },
  { id: 17, name: "Phishing_IOCs_List.csv", type: "csv", indexed: true },
  { id: 18, name: "Network_Map.pptx", type: "pptx", indexed: true },
  { id: 19, name: "Security_Bulletins_June2024.pdf", type: "pdf", indexed: true },
  { id: 20, name: "HR_Policies_Summer2024.txt", type: "txt", indexed: false },
];

// Acceptable file types for filter select
const FILE_TYPE_OPTIONS = [
  "pdf", "docx", "xlsx", "txt", "csv", "pptx", "md", "json", "ragdata", "zip"
];

const Knowledge = () => {
  // Filtering/search state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterIndexed, setFilterIndexed] = useState(false);
  const [show3rdParty, setShow3rdParty] = useState(false);

  // File "toggle" (enabled/disabled for RAG) state
  const [enabledFiles, setEnabledFiles] = useState<Record<number, boolean>>(() =>
    DUMMY_FILES.reduce((acc, file) => {
      acc[file.id] = true;
      return acc;
    }, {} as Record<number, boolean>)
  );
  // "Index Now" simulated state: mark as indexed after action
  const [fileIndexed, setFileIndexed] = useState<Record<number, boolean>>(
    () => Object.fromEntries(DUMMY_FILES.map(f => [f.id, f.indexed]))
  );

  // Compute filtered file list
  const filteredFiles = useMemo(() => {
    let files = DUMMY_FILES.map(f => ({ ...f, indexed: fileIndexed[f.id] }));
    if (search.trim()) {
      files = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterType) {
      files = files.filter(f => f.type === filterType);
    }
    if (filterIndexed) {
      files = files.filter(f => f.indexed);
    }
    if (show3rdParty) {
      // For this demo, we'll say only files with .ragdata, .csv, .json, or .xlsx are from 3rd party sources
      files = files.filter(f =>
        ["ragdata", "csv", "json", "xlsx"].includes(f.type)
      );
    }
    return files;
  }, [search, filterType, filterIndexed, show3rdParty, fileIndexed]);

  // Sidebar summary statistics
  const summaryStats = useMemo(() => {
    const total = DUMMY_FILES.length;
    const indexed = Object.values(fileIndexed).filter(Boolean).length;
    const unindexed = total - indexed;
    const thirdParty = DUMMY_FILES.filter(f => ["ragdata", "csv", "json", "xlsx"].includes(f.type)).length;
    return { total, indexed, unindexed, thirdParty };
  }, [fileIndexed]);

  // Action handlers
  const handleIndexFile = (id: number) => {
    setTimeout(() => {
      setFileIndexed(prev => ({ ...prev, [id]: true }));
    }, 800); // Simulate delay
  };
  const handleToggleFile = (id: number) => {
    setEnabledFiles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-3 flex flex-col md:flex-row gap-6">
        <main className="flex-1 space-y-8">
          <div className="mb-2 flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white">RAG Knowledge Base <span className="ml-2 px-2 py-0.5 rounded bg-cyber-gunmetal/60 text-xs text-cyber-red font-mono">DEMO DATA</span></h1>
            <p className="max-w-lg text-gray-300">
              View & manage documents used for Retrieval-Augmented Generation (RAG). Filter, search, control file status, and monitor external integrations.
            </p>
          </div>
          <Card className="bg-cyber-darker border-cyber-gunmetal">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <File className="h-5 w-5 text-cyber-red" />
                Files in Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-2 mb-2 items-stretch md:items-end">
                <div className="flex-1 flex items-center bg-cyber-gunmetal rounded-md overflow-hidden">
                  <Search className="ml-3 text-gray-400 shrink-0" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="!bg-transparent border-none text-white"
                    placeholder="Search files by name..."
                  />
                </div>
                <select
                  className="rounded-md p-2 bg-cyber-gunmetal border-cyber-gunmetal text-white"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value="">All types</option>
                  {FILE_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 bg-cyber-gunmetal px-3 py-2 rounded">
                  <Checkbox
                    checked={filterIndexed}
                    onCheckedChange={v => setFilterIndexed(Boolean(v))}
                    id="showIndexed"
                  />
                  <label htmlFor="showIndexed" className="text-xs text-white cursor-pointer">Show Only Indexed</label>
                </div>
                <div className="flex items-center gap-2 bg-cyber-gunmetal px-3 py-2 rounded">
                  <Checkbox
                    checked={show3rdParty}
                    onCheckedChange={v => setShow3rdParty(Boolean(v))}
                    id="show3rdParty"
                  />
                  <label htmlFor="show3rdParty" className="text-xs text-white cursor-pointer">Show Only 3rd Party Sources</label>
                </div>
              </div>
              <RagFileTable
                files={filteredFiles}
                enabledFiles={enabledFiles}
                onToggleFile={handleToggleFile}
                onIndexFile={handleIndexFile}
                fileIndexed={fileIndexed}
                loadingIndexIds={[]} // (optional: for animating indexing, not required in demo)
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-cyber-darker border-cyber-gunmetal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  Custom Fine-Tune Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RagFineTunePrompts />
              </CardContent>
            </Card>
            <Card className="bg-cyber-darker border-cyber-gunmetal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  3rd Party &amp; External Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RagExternalSources />
              </CardContent>
            </Card>
          </div>
        </main>
        <aside className="w-full md:w-72 shrink-0">
          <RagSidebarSummary {...summaryStats} />
        </aside>
      </div>
    </Layout>
  );
};

export default Knowledge;
