
import React from "react";
import { discord, googleSheets, envelope } from "lucide-react";

const EXTERNALS = [
  {
    key: "discord",
    name: "Discord",
    url: "https://discord.gg/socgroup",
    display: "SOC Analyst Discord",
    icon: discord,
    animate: "animate-pulse"
  },
  {
    key: "gsheets",
    name: "Google Sheets",
    url: "https://docs.google.com/spreadsheets/d/1a2b3c4dummy",
    display: "Google Sheets (SOC Logs)",
    icon: googleSheets,
    animate: "animate-bounce"
  },
  {
    key: "email",
    name: "Email Ingestion",
    url: "mailto:soc-reports@company.com",
    display: "soc-reports@company.com",
    icon: envelope,
    animate: "animate-pulse"
  }
];

export default function RagExternalSources() {
  return (
    <ul className="space-y-5">
      {EXTERNALS.map((src) => (
        <li key={src.key} className="flex items-center gap-3">
          <span className={`rounded-full bg-cyber-gunmetal/30 p-2 ${src.animate}`}>
            <src.icon className="h-5 w-5 text-white" />
          </span>
          <div>
            <span className="block text-white font-semibold">{src.name}</span>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-red underline hover:text-cyber-red/80 transition text-sm"
            >
              {src.display}
            </a>
            {src.key === "email" && (
              <div className="text-xs mt-1 text-cyber-red">[demo: detects new emails!]</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
