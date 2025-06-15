
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DemoShiftSummaryList from '@/components/shift-summary/DemoShiftSummaryList';
import TeamFilter from '@/components/shift-summary/TeamFilter';

const ShiftSummaryPage = () => {
  const [selectedTeam, setSelectedTeam] = useState("");

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-48px)] min-h-0 w-full">
        {/* Team filter row at the top */}
        <div className="flex-shrink-0 mt-2 px-2 md:px-0">
          <TeamFilter selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
        </div>
        {/* Demo shift summaries take full space below */}
        <div className="flex-1 min-h-0 mt-2">
          <DemoShiftSummaryList selectedTeam={selectedTeam} />
        </div>
      </div>
    </Layout>
  );
};

export default ShiftSummaryPage;
