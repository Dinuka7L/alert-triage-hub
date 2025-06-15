
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BadgeCheck, Wrench, AlertTriangle, gear as Gear, RefreshCw, FileText, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Connector {
  name: string;
  type: string;
  icon: React.ReactNode;
  status: "Connected" | "Disconnected";
  lastSync: string;
  link?: string;
  verified?: boolean;
  beta?: boolean;
  custom?: boolean;
}

type CardProps = {
  connector: Connector;
  onConfigure: () => void;
  onSync: () => void;
  onLogs: () => void;
  onToggle: () => void;
  toggling: boolean;
  syncing: boolean;
  toggled: boolean;
};

export default function ConnectorCard({
  connector,
  onConfigure,
  onSync,
  onLogs,
  onToggle,
  toggling,
  syncing,
  toggled,
}: CardProps) {
  return (
    <div
      className={`
        glass-tile group relative flex flex-col bg-white/20 backdrop-blur-xl rounded-2xl border border-purple-300/20 
        shadow-lg p-5 overflow-hidden mb-0 transition 
        hover:shadow-[0_0_12px_2px_#7b72ff61]
        hover:ring-2 hover:ring-blue-300/70
        hover:scale-[1.018]
      `}
      style={{
        minWidth: 270,
        maxWidth: 350,
        boxShadow: toggling ? "0 0 12px 2px #6b43ffbb" : undefined,
        border: toggling ? "2px solid #a9b9ff" : undefined,
        opacity: connector.status === "Disconnected" ? 0.88 : 1,
        backdropFilter: "blur(9px)",
      }}
    >
      {/* Mini badges per type */}
      <div className="absolute z-10 top-3 right-4 flex gap-1">
        {connector.verified && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <BadgeCheck className="w-5 h-5 text-green-400" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Verified Source</TooltipContent>
          </Tooltip>
        )}
        {connector.beta && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Beta</TooltipContent>
          </Tooltip>
        )}
        {connector.custom && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Wrench className="w-5 h-5 text-blue-400" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Custom Source</TooltipContent>
          </Tooltip>
        )}
      </div>
      {/* Icon */}
      <div className="mb-1 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="rounded-lg p-2 bg-blue-100/40 shadow-sm">
            {connector.icon}
          </div>
          <span className="font-bold text-lg text-purple-300 drop-shadow">{connector.name}</span>
        </div>
      </div>

      {/* Status + last sync */}
      <div className="flex gap-2 mt-2 mb-2 text-xs items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`
                flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold
                ${connector.status === "Connected" ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"}
              `}
            >
              {connector.status}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {connector.status === "Connected" ? "Online and active" : "Disconnected. Needs reconnection."}
          </TooltipContent>
        </Tooltip>
        <span className="ml-1 opacity-70">
          Last Sync: <span className="font-mono">{connector.lastSync}</span>
        </span>
      </div>

      {/* Dummy info/link */}
      {connector.link && (
        <div className="truncate text-blue-300 text-xs pb-1">
          <a href={connector.link} target="_blank" className="underline">{connector.link}</a>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 mt-3 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-blue-500/30 p-2"
              onClick={onConfigure}
              aria-label="Configure"
            >
              <Gear className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Configure</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={`hover:bg-blue-600/25 p-2 ${syncing && "animate-spin"}`}
              onClick={onSync}
              disabled={syncing || connector.status === "Disconnected"}
              aria-label="Sync Now"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sync Now</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-purple-400/20 p-2"
              onClick={onLogs}
              aria-label="View Logs"
            >
              <FileText className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Logs</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Switch
                checked={toggled}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-purple-400/80 data-[state=unchecked]:bg-gray-400/20"
                disabled={toggling}
                aria-label="Toggle Connection"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>{toggled ? "Turn Off" : "Activate"}</TooltipContent>
        </Tooltip>
        {/* If Disconnected, show Reconnect */}
        {connector.status === "Disconnected" && (
          <Button
            size="sm"
            variant="secondary"
            className="ml-2 bg-yellow-200/70 text-yellow-900 border border-yellow-300 hover:bg-yellow-300/80 px-2 text-xs font-bold"
            onClick={() => alert("Dummy: Reconnect")}
          >
            Reconnect
          </Button>
        )}
      </div>
    </div>
  );
}

