
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

const DUMMY_LOGS = [
  {
    time: "10:01 AM",
    source: "Discord",
    result: "Success",
    duration: "1.3s",
  },
  {
    time: "09:37 AM",
    source: "Google Sheets",
    result: "Success",
    duration: "2.0s",
  },
  {
    time: "08:55 AM",
    source: "AWS S3 Bucket",
    result: "Fail",
    duration: "3.0s",
  },
  {
    time: "08:20 AM",
    source: "Confluence",
    result: "Success",
    duration: "1.1s",
  },
  {
    time: "08:00 AM",
    source: "Jira Tickets",
    result: "Success",
    duration: "1.9s",
  },
];

export default function ConnectorLogsTable() {
  return (
    <div className="mt-9 shadow-lg rounded-xl bg-white/10 backdrop-blur border border-blue-200/30 px-2 py-2">
      <div className="text-sm font-medium px-3 py-2 mb-0.5 text-blue-200">Last 5 Sync Logs</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Time</TableHead>
            <TableHead className="w-44">Source</TableHead>
            <TableHead className="w-24">Result</TableHead>
            <TableHead className="w-24">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DUMMY_LOGS.map((log, i) => (
            <TableRow key={i} className="hover:bg-blue-100/10">
              <TableCell className="font-mono text-xs">{log.time}</TableCell>
              <TableCell>{log.source}</TableCell>
              <TableCell>
                {log.result === "Success" ? (
                  <span className="flex gap-1 items-center text-green-400"><CheckCircle className="w-4 h-4" />Success</span>
                ) : (
                  <span className="flex gap-1 items-center text-red-400"><XCircle className="w-4 h-4" />Fail</span>
                )}
              </TableCell>
              <TableCell>{log.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
