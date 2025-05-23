import { useState } from "react";
import CostSummary from "./CostSummary";
import ResourceDetails from "./ResourceDetails";
import {
  CostSummary as CostSummaryType,
  ResourceGroup,
} from "../../types/cost";
import { Button } from "../ui/button";

interface CostDashboardProps {
  costData: CostSummaryType;
}

const CostDashboard = ({ costData }: CostDashboardProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleSelectGroup = (groupId: string | null) => {
    setSelectedGroup(groupId);
  };

  // Filter groups if a group is selected
  const filteredGroups = selectedGroup
    ? costData.groups.filter((group) => group.id === selectedGroup)
    : costData.groups;

  return (
    <div className="flex flex-col min-h-screen bg-ui-dark text-ui-text">
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <CostSummary
          groups={costData.groups}
          totalCost={costData.totalCost}
          selectedGroup={selectedGroup}
          onSelectGroup={handleSelectGroup}
        />
        <ResourceDetails
          groups={filteredGroups}
          totalCost={costData.totalCost}
        />
      </main>
    </div>
  );
};

export default CostDashboard;
