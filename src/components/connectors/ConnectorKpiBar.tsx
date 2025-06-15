
import React from "react";
import { BadgeCheck, XOctagon, RefreshCw } from "lucide-react";

interface Kpi {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color: string;
}

const KPIS: Kpi[] = [
  {
    label: "Total Sources",
    value: 10,
    icon: <BadgeCheck className="w-5 h-5 text-blue-400" />,
    color: "from-blue-400/80 to-blue-200/50",
  },
  {
    label: "Successful Syncs (Today)",
    value: 25,
    icon: <RefreshCw className="w-5 h-5 text-green-400" />,
    color: "from-green-400/70 to-green-200/40",
  },
  {
    label: "Failed Syncs (Today)",
    value: 3,
    icon: <XOctagon className="w-5 h-5 text-red-300" />,
    color: "from-red-400/70 to-red-200/40",
  },
];

const kpiClass = "bg-white/10 border border-white/20 rounded-xl shadow-lg px-6 py-4 flex flex-col items-center min-w-[138px] transition hover:scale-[1.04] hover:shadow-blue-100/50 duration-150";

export default function ConnectorKpiBar() {
  return (
    <div className="flex flex-wrap gap-4 justify-between w-full mb-7">
      {KPIS.map((k, i) => (
        <div
          key={i}
          className={`${kpiClass} backdrop-blur-md`}
          style={{
            background: `linear-gradient(133deg, ${k.color})`,
            boxShadow: "0 0 22px 0 #a3a7f344",
          }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold opacity-80 mb-1">
            {k.icon}
            <span>{k.label}</span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-100 drop-shadow">{k.value}</div>
        </div>
      ))}
    </div>
  );
}
