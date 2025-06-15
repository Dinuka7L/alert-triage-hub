
import React, { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { File, Discord, Mail, GoogleSheets } from "lucide-react";
import { Button } from "@/components/ui/button";

// Glass style helpers
const glass = "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl";
const shadowGlow = "shadow-[0_0_40px_0_rgba(42,196,255,0.20)]";
const kpiGlass = "bg-white/10 border border-white/15 rounded-xl shadow-lg px-6 py-4 flex flex-col items-center min-w-[120px]";

const neonColors = {
  blue: "#2AC4FF",
  purple: "#B369F7",
  green: "#30ECA6",
  red: "#FF4560",
  yellow: "#FFEB3B",
};

const chartBg = "bg-gradient-to-br from-cyber-gunmetal/60 to-cyber-darker/80";
const chartBox = `${glass} ${shadowGlow} p-4 pb-2 transition hover:ring-4 hover:ring-cyan-400 hover:bg-white/20 duration-150`;

// Dummy KPI data
const KPIS = [
  { label: "Total Files", value: 20 },
  { label: "Total Indexed", value: 12 },
  { label: "New Files (24h)", value: 3 },
  { label: "Queries Processed", value: 134 },
  { label: "Query Accuracy", value: "89%" },
];

// Pie chart data: RAG Indexing Overview
const pieIndexingData = [
  { name: "Indexed", value: 12, color: neonColors.green },
  { name: "Unindexed", value: 8, color: neonColors.red },
];

// File type bar chart data (vertical)
const barFileTypeData = [
  { type: "PDF", count: 5 },
  { type: "DOCX", count: 4 },
  { type: "CSV", count: 3 },
  { type: "MD", count: 2 },
  { type: "JSON", count: 2 },
  { type: "Other", count: 4 },
];

// Donut chart: Third Party Source
const donutSourcesData = [
  { name: "Discord", value: 2, color: neonColors.blue, icon: <Discord className="w-4 h-4" /> },
  { name: "Google Sheets", value: 1, color: neonColors.green, icon: <GoogleSheets className="w-4 h-4" /> },
  { name: "Email Ingestion", value: 1, color: neonColors.purple, icon: <Mail className="w-4 h-4" /> },
];

// Growth over 7 days
const lineGrowthData = [
  { day: "Day 1", files: 5 },
  { day: "Day 2", files: 6 },
  { day: "Day 3", files: 8 },
  { day: "Day 4", files: 12 },
  { day: "Day 5", files: 14 },
  { day: "Day 6", files: 18 },
  { day: "Day 7", files: 20 },
];

// Horizontal bar: Query Success vs Fail
const queryResultData = [
  { label: "Success", value: 85, color: neonColors.green },
  { label: "Fail", value: 15, color: neonColors.red },
];

// Heat grid: 7x24 (7 days x 24 hours)
const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Generate activity dummy data
function makeHeatData() {
  const grid = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      // More hits on Tue at 14:00 and 16:00, less on Sun 5:00
      let activity = Math.floor(Math.random() * 6);
      if (d === 2 && (h === 14 || h === 16)) activity = 12 + Math.floor(Math.random() * 4);
      if (d === 0 && h === 5) activity = 0;
      grid.push({ day: d, hour: h, value: activity });
    }
  }
  return grid;
}

const heatData = makeHeatData();

// Utility for color gradient (blue to red)
function getHeatColor(val: number) {
  // 0 = blue, 12+ = red
  const r = Math.min(255, Math.round(32 + (val / 13) * (255 - 32)));
  const g = Math.round(72 + (val / 13) * (120 - 72));
  const b = Math.round(255 - (val / 13) * (255 - 64));
  return `rgb(${r},${g},${b})`;
}

// Animated bar chart: automatic refresh simulation
const useAutoRefresh = (cb: () => void, delay: number) => {
  React.useEffect(() => {
    const i = setInterval(cb, delay);
    return () => clearInterval(i);
  }, [cb, delay]);
};

const AnalyticsDashboard: React.FC = () => {
  // Theme toggle (simple local/dummy, integrates with page if desired)
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  // Simulated refresh (toggles a flag, triggers animations)
  const [dataKey, setDataKey] = useState(0);
  useAutoRefresh(() => setDataKey(k => k + 1), 7000);

  // Glass background with neon edge based on theme
  const dashBg = theme === "dark"
    ? `${glass} ${shadowGlow} border border-cyan-400/50 bg-gradient-to-br from-cyber-darker/80 to-cyber-gunmetal/60`
    : `${glass} border border-blue-300/40 bg-gradient-to-br from-blue-100/80 to-white/60 shadow-[0_0_32px_0_rgba(76,110,255,0.17)]`;

  // Optionally, charts/labels swap text color in light theme
  const textBase = theme === "dark" ? "text-white" : "text-blue-950";
  
  // KPI bar at the top
  const KpiBar = () => (
    <div className="flex flex-wrap gap-4 justify-between w-full mb-6">
      {KPIS.map((k, i) => (
        <div
          key={i}
          className={`${kpiGlass} ${shadowGlow} hover:ring-2 hover:ring-cyan-400 transition ${theme === "dark" ? "text-white" : "text-blue-900"} relative`}
        >
          <div className="text-xs font-semibold opacity-65 mb-1">{k.label}</div>
          <div className="text-2xl font-bold font-mono">{k.value}</div>
        </div>
      ))}
    </div>
  );

  // Pie Chart panel
  const PiePanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-cyan-400">RAG Indexing Overview</div>
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie
            data={pieIndexingData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            startAngle={260}
            endAngle={-100}
            dataKey="value"
            isAnimationActive
            animationBegin={0}
            animationDuration={800}
            >
            {pieIndexingData.map((entry, i) => (
              <Cell key={i} fill={entry.color} className="cursor-pointer" />
            ))}
          </Pie>
          <ReTooltip
            contentStyle={{
              background: "rgba(30, 30, 38, 0.95)",
              borderRadius: 12,
              color: "#fff",
              border: "1px solid #85e0ff",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 3px 14px #18014a67",
            }}
            formatter={(value, name) => [
              `${value} files`,
              name === "Indexed" ? "Indexed" : "Unindexed",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-3 mt-3 text-xs justify-center">
        {pieIndexingData.map(e => (
          <span
            key={e.name}
            className={`flex items-center gap-1`}
            style={{ color: e.color }}
          >
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: e.color }} />{e.name}
          </span>
        ))}
      </div>
    </div>
  );

  // File Type Breakdown: Bar chart
  const BarPanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-purple-300">File Types Breakdown</div>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart
          data={barFileTypeData}
          barSize={24}
          key={dataKey} // Re-mount for animation on refresh
        >
          <XAxis dataKey="type" stroke="#D2BBFF" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#D2BBFF" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Bar dataKey="count" radius={[8, 8, 2, 2]} isAnimationActive>
            {barFileTypeData.map((entry, i) => (
              <Cell key={i} fill={neonColors.purple} className="cursor-pointer" />
            ))}
          </Bar>
          <ReTooltip
            cursor={{ fill: "rgba(179,105,247,0.15)" }}
            contentStyle={{
              background: "#271841",
              borderRadius: 10,
              color: "#fff",
              border: "1px solid #da85ff",
            }}
            formatter={value => [`${value} files`, "Count"]}
            labelFormatter={label => label}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // Donut: Third Party Sources
  const DonutPanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-blue-300">Third-Party Source Usage</div>
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie
            data={donutSourcesData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={67}
            paddingAngle={4}
            isAnimationActive
            animationDuration={900}
            >
            {donutSourcesData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <ReTooltip
            contentStyle={{
              background: "#181F39",
              borderRadius: 13,
              color: "#fff",
              border: "1px solid #57faf7",
            }}
            formatter={(_, index, payload) => {
              const d = payload && payload[index] ? payload[index].payload : null;
              return [d ? `${d.value} links` : "", d ? d.name : ""];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-2">
        {donutSourcesData.map((e, i) => (
          <span className="flex items-center gap-1 text-xs group" key={e.name}>
            <span className="w-3 h-3 rounded-full" style={{ background: e.color }} />
            <span className="neon-glow">{e.icon}</span>
            <span className={`${textBase}`}>{e.name}</span>
          </span>
        ))}
      </div>
    </div>
  );

  // Line panel: KB Growth
  const LinePanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-green-400">KB Growth Over 7 Days</div>
      <ResponsiveContainer width="100%" height={170}>
        <LineChart
          data={lineGrowthData}
          margin={{ top: 10, right: 12, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="4" stroke="#355" />
          <XAxis dataKey="day" stroke="#8fffe7" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#32ffb6" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Line
            type="monotone"
            dataKey="files"
            stroke={neonColors.green}
            strokeWidth={3}
            dot={{ stroke: neonColors.green, fill: "#111", r: 7, strokeWidth: 2, className: "transition-all hover:scale-110", style: { filter: "drop-shadow(0 0 8px #43FFA4)" } }}
            activeDot={{ r: 10, style: { filter: "drop-shadow(0 0 16px #30ECA6)" } }}
            isAnimationActive
            animationDuration={900}
          />
          <ReTooltip
            contentStyle={{
              background: "#091A16",
              borderRadius: 11,
              color: "#fff",
              border: "1px solid #30ECA6",
            }}
            formatter={(v) => [`${v} files`]}
            labelFormatter={l => `${l}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Query Success/Fail panel: horizontal bars
  const HBarPanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-3 text-green-300">Query Success vs Failure</div>
      <div className="flex flex-col gap-2 px-2 pt-2 pb-0">
        {queryResultData.map((d, i) => (
          <div
            key={d.label}
            className="relative h-7 w-full flex items-center group"
            style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10 }}
            tabIndex={0}
          >
            <div
              className="h-full rounded-2xl flex items-center text-xs text-white font-bold justify-center transition-all"
              style={{
                width: `${d.value}%`,
                background: d.color,
                boxShadow: `0 0 14px 3px ${d.color}55`,
                minWidth: 40,
                transition: "width 0.5s cubic-bezier(.3,1.4,.7,.81)",
              }}
            >
              <span className="ml-2">{d.label}</span>
              <span className="ml-auto px-3">{d.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Heat Map panel
  const HeatPanel = () => (
    <div className={chartBox + " min-h-[210px]"}>
      <div className="font-bold mb-2 text-blue-400">Recent Activity Heatmap</div>
      <div className="overflow-auto px-0 pb-2">
        <div className="grid grid-cols-25 gap-0.5">
          <div className="col-span-1" />
          {hours.map(h =>
            <div key={"h" + h} className="text-[10px] text-gray-300 p-0.5 text-center">{h % 6 === 0 ? `${h}` : ""}</div>
          )}
        </div>
        {days.map((d, di) => (
          <div key={d} className="grid grid-cols-25 gap-0.5 items-center">
            <div className="text-xs w-7 text-right pr-2 text-gray-400">{d}</div>
            {hours.map(h => {
              const dat = heatData.find(dd => dd.day === di && dd.hour === h);
              return (
                <div
                  key={d + h}
                  title={`${d} ${h}:00 — ${dat?.value ?? 0} hits`}
                  className="rounded cursor-pointer transition-all"
                  style={{
                    width: 13,
                    height: 13,
                    background: getHeatColor(dat?.value ?? 0),
                    border: dat?.value > 10 ? "1.5px solid #ff0033" : "1px solid rgba(160,160,255,0.11)",
                    filter: dat?.value > 10 ? "drop-shadow(0 0 7px #fd003a99)" : undefined,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // Download (dummy) button
  function handleDownload() {
    // Simulate download - flash; add logic as desired.
    alert("Downloading analytics report (dummy)!");
  }

  // Theme toggle (optional)
  const ThemeToggle = () => (
    <button
      className="absolute top-5 right-7 z-10 text-xs rounded-lg px-4 py-1.5 font-bold transition 
        bg-white/10 border border-cyan-400/70 shadow 
        hover:bg-cyan-500/30 text-cyan-300 hover:text-white
        backdrop-blur"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle light/dark mode"
    >
      {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );

  return (
    <div className={`${dashBg} px-4 py-8 relative overflow-hidden w-full mb-8 animate-fade-in`}>
      <ThemeToggle />
      <div className="mx-auto max-w-7xl">
        <div className="mb-1 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <h2 className={`text-3xl font-black tracking-tight mb-3 drop-shadow glow text-glow ${
            theme === "dark" ? "text-white" : "text-blue-900"
          }`}>📊 Knowledge Base Analytics</h2>
          <Button
            className="bg-cyan-400/70 backdrop-blur-md border border-cyan-300 text-white font-bold px-7 py-2 rounded-xl hover:bg-cyan-500/90 transition shadow-lg active:scale-95 hover:shadow-[0_0_24px_0_rgba(12,241,249,0.70)] focus:ring-2 focus:ring-cyan-300 focus:outline-none"
            style={{
              boxShadow: `0 0 0 2px #ffffff22, 0 4px 24px 0 #1cfafd66`,
              textShadow: "0 0 6px #60eaff",
            }}
            onClick={handleDownload}
          >
            Download Report
          </Button>
        </div>
        <KpiBar />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Row 1 */}
          <PiePanel />
          <BarPanel />
          <DonutPanel />
          {/* Row 2 */}
          <LinePanel />
          <HBarPanel />
          <HeatPanel />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
