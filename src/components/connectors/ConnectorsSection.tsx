
import React, { useState } from "react";
import ConnectorKpiBar from "./ConnectorKpiBar";
import ConnectorHealthDonut from "./ConnectorHealthDonut";
import ConnectorCard, { Connector } from "./ConnectorCard";
import ConnectorAddModal from "./ConnectorAddModal";
import ConnectorLogsTable from "./ConnectorLogsTable";
import { Plus, Users, FileText, Mail, Cloud, Layers, Server, Slack, Folder, Wrench, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Dummy Data List ---
const CONNECTORS: Connector[] = [
  {
    name: "Discord Integration",
    type: "discord",
    icon: <Users className="w-7 h-7 text-blue-400" />,
    status: "Connected",
    lastSync: "2 hours ago",
    link: "https://discord.gg/socgroup",
    verified: true,
  },
  {
    name: "Google Sheets",
    type: "sheets",
    icon: <FileText className="w-7 h-7 text-green-300" />,
    status: "Connected",
    lastSync: "41 min ago",
    link: "https://docs.google.com/spreadsheets/d/1a2b3c4dummy",
    beta: true,
  },
  {
    name: "Email Ingestion",
    type: "email",
    icon: <Mail className="w-7 h-7 text-pink-400" />,
    status: "Connected",
    lastSync: "12 min ago",
    link: "soc-reports@company.com",
    custom: true,
  },
  {
    name: "OneDrive",
    type: "onedrive",
    icon: <Cloud className="w-7 h-7 text-blue-200" />,
    status: "Disconnected",
    lastSync: "N/A",
    beta: true,
  },
  {
    name: "SharePoint",
    type: "sharepoint",
    icon: <Cloud className="w-7 h-7 text-sky-300" />,
    status: "Connected",
    lastSync: "1 hour ago",
    verified: true,
  },
  {
    name: "Confluence",
    type: "confluence",
    icon: <Layers className="w-7 h-7 text-purple-400" />,
    status: "Connected",
    lastSync: "37 min ago",
    custom: true,
  },
  {
    name: "AWS S3 Bucket",
    type: "s3",
    icon: <Folder className="w-7 h-7 text-yellow-300" />,
    status: "Connected",
    lastSync: "20 min ago",
  },
  {
    name: "Slack Workspace",
    type: "slack",
    icon: <Slack className="w-7 h-7 text-yellow-400" />,
    status: "Disconnected",
    lastSync: "N/A",
    beta: true,
  },
  {
    name: "Jira Tickets",
    type: "jira",
    icon: <Wrench className="w-7 h-7 text-indigo-300" />,
    status: "Connected",
    lastSync: "9 min ago",
  },
  {
    name: "FTP Server",
    type: "ftp",
    icon: <Server className="w-7 h-7 text-emerald-300" />,
    status: "Connected",
    lastSync: "5 min ago",
    custom: true,
  },
];

// --- Filter Helpers ---
const STATUSES = [
  { label: "All", val: "all" },
  { label: "Connected", val: "Connected" },
  { label: "Disconnected", val: "Disconnected" },
  { label: "Beta Connectors", val: "beta" },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Main Section ---
export default function ConnectorsSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [syncingIdx, setSyncingIdx] = useState<number | null>(null);
  const [togglingIdx, setTogglingIdx] = useState<number | null>(null);
  const [connectorStates, setConnectorStates] = useState(CONNECTORS.map(c => c.status === "Connected"));

  // Dummy handlers for demo actions:
  const handleSync = async (i: number) => {
    setSyncingIdx(i);
    await sleep(1200); // Simulate sync
    setSyncingIdx(null);
    alert("Dummy: Synced " + CONNECTORS[i].name);
  };
  const handleToggle = async (i: number) => {
    setTogglingIdx(i);
    await sleep(750); // Simulate
    setConnectorStates(arr => {
      const c = [...arr];
      c[i] = !c[i];
      return c;
    });
    setTogglingIdx(null);
  };
  // Filtering logic
  const shownConnectors = CONNECTORS
    .filter((c, i) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "Connected") return connectorStates[i];
      if (statusFilter === "Disconnected") return !connectorStates[i];
      if (statusFilter === "beta") return !!c.beta;
      return true;
    })
    .filter((c) => search.trim() === "" || c.name.toLowerCase().includes(search.trim().toLowerCase()));

  // Dummy modal actions:
  const handleConfigure = () => alert("Dummy: Open configure modal");
  const handleLogs = () => alert("Dummy: Open logs/console");
  // Add Modal Open/Close:
  const openAddModal = () => setAddOpen(true);
  const closeAddModal = () => setAddOpen(false);

  return (
    <div
      className="p-6 rounded-2xl border border-blue-300/30 shadow-[0_4px_30px_0px_#cfd1fc22] bg-white/10 backdrop-blur-xl"
    >
      {/* KPIs */}
      <ConnectorKpiBar />
      {/* Controls: Donut, Add, Filters, Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <div className="flex flex-1 items-center gap-8">
          <ConnectorHealthDonut />
          {/* Add New Connector */}
          <Button
            onClick={openAddModal}
            size="lg"
            className="glass-tile group ml-8 px-8 py-4 bg-gradient-to-tr from-blue-400/40 to-purple-300/40 border border-blue-200/60 shadow-lg text-blue-900 hover:bg-purple-400/40 hover:ring-blue-200/50 font-black text-lg rounded-2xl flex gap-3 items-center transition hover:scale-105 focus:ring-2 focus:ring-blue-200"
            style={{
              boxShadow: "0 4px 20px 0 #a8b3ff33",
              textShadow: "0 1px 14px #b3b6fd44",
            }}
          >
            <Plus className="w-6 h-6 mr-1" />
            Add New Connector
          </Button>
        </div>
        {/* Filters/Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 bg-white/10 px-3 py-2 rounded-xl border border-blue-200/30">
            {STATUSES.map(opt => (
              <button
                key={opt.val}
                className={`
                  text-xs px-2 py-1 rounded-lg font-bold transition 
                  ${statusFilter === opt.val ? "bg-blue-400/90 text-white shadow" : "hover:bg-blue-200/70 text-blue-900"}
                `}
                onClick={() => setStatusFilter(opt.val)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search connectors..."
            className="ml-2 w-44 max-w-xs border-2 border-blue-100/60 bg-white/10 text-blue-900 px-3 py-1.5 rounded-lg placeholder:text-blue-400/60 font-semibold focus:ring-2 focus:ring-blue-300/70"
          />
        </div>
      </div>
      {/* Connector Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shownConnectors.length === 0 && (
          <div className="col-span-full text-center text-blue-300 bg-blue-50/20 py-7 rounded-lg font-semibold">
            No connectors found for that search/filter.
          </div>
        )}
        {shownConnectors.map((conn, idx) => {
          const i = CONNECTORS.findIndex(c => c.name === conn.name);
          return (
            <ConnectorCard
              key={conn.name}
              connector={conn}
              onConfigure={handleConfigure}
              onSync={() => handleSync(i)}
              onLogs={handleLogs}
              toggling={togglingIdx === i}
              syncing={syncingIdx === i}
              onToggle={() => handleToggle(i)}
              toggled={connectorStates[i]}
            />
          );
        })}
      </div>
      <ConnectorAddModal open={addOpen} onOpenChange={setAddOpen} />
      {/* Logs */}
      <ConnectorLogsTable />
    </div>
  );
}
