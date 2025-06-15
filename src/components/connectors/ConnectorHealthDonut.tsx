
import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const donutData = [
  { name: "Active", value: 7, color: "#36f88a" },
  { name: "Inactive", value: 3, color: "#c7c3fa" },
];

export default function ConnectorHealthDonut() {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-blue-200/30 rounded-2xl shadow-lg px-5 py-5 flex flex-col items-center min-w-[180px] max-w-[220px] hover:ring-4 hover:ring-blue-200/40 transition">
      <div className="font-semibold text-xs mb-2 text-blue-300 tracking-wide">Connection Health</div>
      <PieChart width={100} height={100}>
        <Pie
          data={donutData}
          cx={50}
          cy={50}
          startAngle={-100}
          endAngle={260}
          innerRadius={30}
          outerRadius={44}
          paddingAngle={5}
          dataKey="value"
          isAnimationActive
        >
          {donutData.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="flex gap-3 text-xs mt-2">
        {donutData.map(d => (
          <span key={d.name} className="flex gap-1 items-center">
            <span className="w-2.5 h-2.5 inline-block rounded-full" style={{background: d.color}} />
            {d.name}
          </span>
        ))}
      </div>
      <div className="text-xs mt-1 opacity-90">Total: 10</div>
    </div>
  );
}
