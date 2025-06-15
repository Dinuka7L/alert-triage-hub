
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ShiftSummaryList from '@/components/shift-summary/ShiftSummaryList';
import DemoShiftSummaryList from '@/components/shift-summary/DemoShiftSummaryList';
import TeamFilter from '@/components/shift-summary/TeamFilter';
import { ScrollArea } from '@/components/ui/scroll-area';

// Removed Button and Sheet for New Summary (right side)

const ShiftSummaryPage = () => {
  const [selectedTeam, setSelectedTeam] = useState("");

  return (
    <Layout>
      {/* Container fills viewport height under header/sidebar, prevents extra space */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 h-[calc(100vh-48px)] min-h-0 w-full">
        {/* Left: Demo */}
        <div className="w-full md:w-[32%] flex flex-col min-h-0 flex-1">
          <TeamFilter selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
          <div className="relative flex-1 min-h-0">
            {/* Take all remaning space */}
            <ScrollArea className="h-full min-h-0">
              <DemoShiftSummaryList selectedTeam={selectedTeam} />
            </ScrollArea>
          </div>
        </div>
        {/* Right: Only Demo list now */}
        <div className="w-full md:w-[68%] flex flex-col min-h-0 flex-1">
          <div className="relative flex-1 min-h-0">
            <ScrollArea className="h-full min-h-0">
              <DemoShiftSummaryList selectedTeam={selectedTeam} />
            </ScrollArea>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftSummaryPage;
