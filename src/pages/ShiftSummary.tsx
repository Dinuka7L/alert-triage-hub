
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DemoShiftSummaryList from '@/components/shift-summary/DemoShiftSummaryList';
import TeamFilter from '@/components/shift-summary/TeamFilter';

const ShiftSummaryPage = () => {
  const [selectedTeam, setSelectedTeam] = useState("");

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 h-[calc(100vh-48px)] min-h-0 w-full">
        {/* Left: Only TeamFilter */}
        <div className="w-full md:w-[32%] flex flex-col min-h-0 flex-1">
          <TeamFilter selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
        </div>
        {/* Right: Demo shift summary */}
        <div className="w-full md:w-[68%] flex flex-col min-h-0 flex-1">
          <div className="relative flex-1 min-h-0">
            <DemoShiftSummaryList selectedTeam={selectedTeam} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftSummaryPage;
