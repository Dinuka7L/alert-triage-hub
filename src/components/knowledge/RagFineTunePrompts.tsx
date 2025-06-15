
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Dummy fine-tune prompt commands
const PROMPTS = [
  "Summarize security incidents from SOC shift summaries.",
  "Extract CVE identifiers from incident reports.",
  "List users with excessive login failures.",
  "Detect potential insider threats using log data.",
  "Summarize phishing trends in emails."
];

export default function RagFineTunePrompts() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center gap-2 text-white font-semibold py-2 px-3 rounded transition hover:bg-cyber-red/10 focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {open ? "Hide Example Prompts" : "Show Example Prompts"}
      </button>
      <div
        className={`transition-all duration-200 ${open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 overflow-hidden"}`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <ul className="pl-2 space-y-2">
          {PROMPTS.map((cmd, i) => (
            <li key={cmd}
              className="bg-cyber-gunmetal/70 border-l-4 border-cyber-red px-3 py-2 rounded text-gray-100 shadow"
            >
              <span className="font-mono text-xs text-cyber-red mr-2">#{i+1}</span>
              {cmd}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
