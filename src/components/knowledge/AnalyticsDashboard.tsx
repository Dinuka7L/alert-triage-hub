
import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { File, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// Glass style helpers
const glass = "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl";
// CHANGED: Red glow shadow
const shadowGlow = "shadow-[0_0_40px_0_rgba(198,40,40,0.28)]";
const kpiGlass = "bg-white/10 border border-white/15 rounded-xl shadow-lg px-6 py-4 flex flex-col items-center min-w-[120px]";

// Neon color palette (kept blue/purple/green for data, but glows are now red)
const neonColors = {
  blue: "#2AC4FF",
  purple: "#B369F7",
  green: "#30ECA6",
  red: "#FF4560",
  yellow: "#FFEB3B",
};

// CHANGED: chart box with red tint and hover ring red
const chartBox = `${glass} ${shadowGlow} p-4 pb-2 transition hover:ring-4 hover:ring-red-500 hover:bg-white/15 duration-150`;

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
  { name: "Discord", value: 2, color: neonColors.blue, icon: <Users className="w-4 h-4" /> },
  { name: "Google Sheets", value: 1, color: neonColors.green, icon: <File className="w-4 h-4" /> },
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
      let activity = Math.floor(Math.random() * 6);
      if (d === 2 && (h === 14 || h === 16)) activity = 12 + Math.floor(Math.random() * 4);
      if (d === 0 && h === 5) activity = 0;
      grid.push({ day: d, hour: h, value: activity });
    }
  }
  return grid;
}

const heatData = makeHeatData();

// Utility for color gradient (blue to red) — just a subtle tweak to let high values go aggressively red
function getHeatColor(val: number) {
  // 0 = pale, 13+ = punchy red
  const r = Math.min(255, Math.round(198 + (val / 13) * (255 - 198)));
  const g = Math.round(40 - (val / 13) * 40);
  const b = Math.round(40 - (val / 13) * 40);
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [dataKey, setDataKey] = useState(0);
  useAutoRefresh(() => setDataKey(k => k + 1), 7000);

  // CHANGED: red accent border for the dashboard
  const dashBg = theme === "dark"
    ? `${glass} ${shadowGlow} border border-red-500/50 bg-gradient-to-br from-cyber-darker/80 to-cyber-gunmetal/60`
    : `${glass} border border-red-300/40 bg-gradient-to-br from-red-100/80 to-white/60 shadow-[0_0_32px_0_rgba(198,40,40,0.18)]`;

  // CHANGED: use red for text accents
  const textBase = theme === "dark" ? "text-white" : "text-red-950";
  
  // KPI bar at the top (glow and hover ring now red)
  const KpiBar = () => (
    <div className="flex flex-wrap gap-4 justify-between w-full mb-6">
      {KPIS.map((k, i) => (
        <div
          key={i}
          className={`${kpiGlass} ${shadowGlow} hover:ring-2 hover:ring-red-500 transition ${theme === "dark" ? "text-white" : "text-red-900"} relative`}
        >
          <div className="text-xs font-semibold opacity-65 mb-1">{k.label}</div>
          <div className="text-2xl font-bold font-mono">{k.value}</div>
        </div>
      ))}
    </div>
  );

  // Pie Chart panel (change title and tooltip accents to red)
  const PiePanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-red-400">RAG Indexing Overview</div>
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
              background: "rgba(38,20,20,0.95)",
              borderRadius: 12,
              color: "#fff",
              border: "1px solid #ff1744",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 3px 14px #910B1467",
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

  // File Type Breakdown: Bar chart (title/tooltip purple + red border hover)
  const BarPanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-purple-300">File Types Breakdown</div>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart
          data={barFileTypeData}
          barSize={24}
          key={dataKey}
        >
          <XAxis dataKey="type" stroke="#FFD2D2" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#FFD2D2" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Bar dataKey="count" radius={[8, 8, 2, 2]} isAnimationActive>
            {barFileTypeData.map((entry, i) => (
              <Cell key={i} fill={neonColors.purple} className="cursor-pointer" />
            ))}
          </Bar>
          <ReTooltip
            cursor={{ fill: "rgba(198,40,40,0.15)" }}
            contentStyle={{
              background: "#271818",
              borderRadius: 10,
              color: "#fff",
              border: "1px solid #ff1744",
            }}
            formatter={value => [`${value} files`, "Count"]}
            labelFormatter={label => label}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // Donut: Third Party Sources (title/tooltip red accent)
  const DonutPanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-red-300">Third-Party Source Usage</div>
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
              background: "#391818",
              borderRadius: 13,
              color: "#fff",
              border: "1px solid #ff1744",
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

  // Line panel: KB Growth (title/tooltip green, but grid/cursor accents subtle red)
  const LinePanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-2 text-green-400">KB Growth Over 7 Days</div>
      <ResponsiveContainer width="100%" height={170}>
        <LineChart
          data={lineGrowthData}
          margin={{ top: 10, right: 12, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="4" stroke="#5f2323" />
          <XAxis dataKey="day" stroke="#ffbebe" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#ffccc4" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} allowDecimals={false} />
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
              background: "#391818",
              borderRadius: 11,
              color: "#fff",
              border: "1px solid #ff1744",
            }}
            formatter={(v) => [`${v} files`]}
            labelFormatter={l => `${l}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Query Success/Fail panel: horizontal bars (title red)
  const HBarPanel = () => (
    <div className={chartBox}>
      <div className="font-bold mb-3 text-red-300">Query Success vs Failure</div>
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

  // Heat Map panel (grid red glow + title text now red)
  const HeatPanel = () => (
    <div className={chartBox + " min-h-[240px]"}>
      <div className="font-bold mb-2 text-red-400">Recent Activity Heatmap</div>
      <div className="w-full flex items-center justify-center p-2">
        <div
          className="relative"
          style={{
            width: 220,
            height: 220,
            minWidth: 180,
            minHeight: 180,
            maxWidth: "100%",
          }}
        >
          {/* Grid labels */}
          <div
            className="absolute left-0 top-4 flex flex-col gap-[4px] z-10 select-none"
            style={{ height: 176 }}
          >
            {days.map((d, idx) => (
              <span
                key={d}
                className="text-[11px] text-gray-300 leading-4 h-[22px] flex items-center justify-end pr-[2px]"
                style={{ height: 22 }}
              >
                {d}
              </span>
            ))}
          </div>
          {/* Hour labels */}
          <div
            className="absolute top-0 left-8 flex gap-[4px] z-10 select-none"
            style={{ width: 176 }}
          >
            {hours.map((h) => (
              <span
                key={h}
                className="text-[10px] text-gray-400 w-[7px] text-center"
                style={{
                  width: 7,
                  height: 16,
                  display: (h % 6 === 0) ? "block" : "none",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {/* Main grid */}
          <div
            className="absolute left-7 top-4 grid"
            style={{
              gridTemplateColumns: "repeat(24, 7px)",
              gridTemplateRows: "repeat(7, 22px)",
              gap: 4,
              width: 176,
              height: 176,
            }}
          >
            {days.map((d, di) =>
              hours.map((h, hi) => {
                const dat = heatData.find(dd => dd.day === di && dd.hour === h);
                return (
                  <div
                    key={`${d}${h}`}
                    title={`${d} ${h}:00 — ${dat?.value ?? 0} hits`}
                    className="rounded transition-all cursor-pointer"
                    style={{
                      width: 7,
                      height: 16,
                      margin: 0,
                      background: getHeatColor(dat?.value ?? 0),
                      border: dat?.value > 10 ? "1.5px solid #ff1744" : "1px solid rgba(198,40,40,0.13)",
                      filter: dat?.value > 10 ? "drop-shadow(0 0 7px #ff174499)" : undefined,
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Download (dummy) button (shadow/ring/red accents)
  function handleDownload() {
    alert("Downloading analytics report (dummy)!");
  }

  // Theme toggle (ring/border/text now red accent)
  const ThemeToggle = () => (
    <button
      className="absolute top-5 right-7 z-10 text-xs rounded-lg px-4 py-1.5 font-bold transition 
        bg-white/10 border border-red-400/70 shadow 
        hover:bg-red-500/30 text-red-300 hover:text-white
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
            theme === "dark" ? "text-white" : "text-red-900"
          }`}>📊 Knowledge Base Analytics</h2>
          <Button
            className="bg-red-500/80 backdrop-blur-md border border-red-400 text-white font-bold px-7 py-2 rounded-xl hover:bg-red-600/90 transition shadow-lg active:scale-95 hover:shadow-[0_0_24px_0_rgba(255,23,68,0.70)] focus:ring-2 focus:ring-red-300 focus:outline-none"
            style={{
              boxShadow: `0 0 0 2px #ff174422, 0 4px 24px 0 #ff174466`,
              textShadow: "0 0 6px #ff1744",
            }}
            onClick={handleDownload}
          >
            Download Report
          </Button>
        </div>
        <KpiBar />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <PiePanel />
          <BarPanel />
          <DonutPanel />
          <LinePanel />
          <HBarPanel />
          <HeatPanel />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
