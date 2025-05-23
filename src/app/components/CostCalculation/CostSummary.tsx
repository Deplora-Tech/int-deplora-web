import { ResourceGroup } from "../../types/cost";
import { cn } from "../../lib/utils";

interface CostSummaryProps {
  groups: ResourceGroup[];
  totalCost: number;
  className?: string;
  selectedGroup?: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

const CostSummary = ({
  groups,
  totalCost,
  className,
  selectedGroup,
  onSelectGroup,
}: CostSummaryProps) => {
  return (
    <div
      className={cn(
        "w-full md:w-72 border-r border-ui-dark-tertiary",
        className
      )}
    >
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>

        <div className="space-y-1">
          {groups.map((group) => (
            <div
              key={group.id}
              className={cn(
                "flex justify-between p-3 rounded-md cursor-pointer",
                selectedGroup === group.id
                  ? "bg-ui-dark-tertiary"
                  : "hover:bg-ui-dark-secondary",
                "transition-colors"
              )}
              onClick={() => onSelectGroup(group.id)}
            >
              <span className="text-xl font-mono">{group.name}</span>
              <span className="font-mono text-xl">
                ${group.cost.toFixed(2)}
              </span>
            </div>
          ))}

          <div
            className={cn(
              "mt-4 pt-4 border-t border-ui-dark-tertiary cursor-pointer",
              selectedGroup === null ? "bg-ui-dark-tertiary" : ""
            )}
            onClick={() => onSelectGroup(null)}
          >
            <div
              className={cn(
                "flex justify-between p-3 font-semibold text-xl",
                selectedGroup === null ? "" : "hover:bg-ui-dark-secondary",
                "transition-colors"
              )}
            >
              <span>Total</span>
              <span className="font-mono">${totalCost.toFixed(2)}/mo</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-ui-text-secondary">
          <p>
            Costs are calculated using your
            <br />
            Terraform configuration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;
