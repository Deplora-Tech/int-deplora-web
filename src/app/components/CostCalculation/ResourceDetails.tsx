import React, { useState } from "react";
import { Resource, ResourceGroup } from "../../types/cost";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";

interface ResourceDetailsProps {
  groups: ResourceGroup[];
  totalCost: number;
}

const ResourceDetails = ({ groups, totalCost }: ResourceDetailsProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-4 text-left text-xl text-white ">
                Resource
              </TableHead>
              <TableHead className="p-4 text-left text-xl text-white ">
                Quantity
              </TableHead>
              <TableHead className="p-4 text-left text-xl text-white">
                Units
              </TableHead>
              <TableHead className="p-4 text-right text-xl text-white">
                Monthly Cost
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <React.Fragment key={group.id}>
                <TableRow
                  className="border-b border-ui-dark-tertiary cursor-pointer hover:bg-ui-dark-secondary group"
                  onClick={() => toggleGroup(group.id)}
                >
                  <TableCell className="p-4 flex items-center">
                    <ChevronDown
                      size={20}
                      className={`mr-2 transition-transform ${
                        expandedGroups[group.id] ? "rotate-180" : ""
                      }`}
                    />
                    <span className="text-xl font-mono">{group.name}</span>
                  </TableCell>
                  <TableCell className="p-4"></TableCell>
                  <TableCell className="p-4"></TableCell>
                  <TableCell className="p-4 text-right font-mono text-xl">
                    ${group.cost.toFixed(2)}
                  </TableCell>
                </TableRow>

                {expandedGroups[group.id] &&
                  group.resources.map((resource) => (
                    <React.Fragment key={resource.id}>
                      <TableRow className="hover:bg-ui-dark-secondary">
                        <TableCell className="p-4 pl-10 text-lg">
                          {resource.name}
                        </TableCell>
                        <TableCell className="p-4 text-center text-lg">
                          {resource.quantity || ""}
                        </TableCell>
                        <TableCell className="p-4 text-center text-lg">
                          {resource.units || ""}
                        </TableCell>
                        <TableCell className="p-4 text-right font-mono text-lg">
                          ${resource.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {resource.children &&
                        resource.children.map((child) => (
                          <TableRow
                            key={child.id}
                            className="hover:bg-ui-dark-secondary"
                          >
                            <TableCell className="p-4 pl-16 text-ui-text-secondary">
                              {child.name}
                            </TableCell>
                            <TableCell className="p-4 text-center text-ui-text-secondary">
                              {child.quantity || ""}
                            </TableCell>
                            <TableCell className="p-4 text-center text-ui-text-secondary">
                              {child.units || ""}
                            </TableCell>
                            <TableCell className="p-4 text-right font-mono text-ui-text-secondary">
                              ${child.cost.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}

            <TableRow className="border-t border-ui-dark-tertiary font-semibold">
              <TableCell className="p-4 text-2xl">Total</TableCell>
              <TableCell className="p-4"></TableCell>
              <TableCell className="p-4"></TableCell>
              <TableCell className="p-4 text-right font-mono text-2xl">
                ${totalCost.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="p-4 text-sm text-ui-text-secondary flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">⚠️</div>
          <div>
            Not all Terraform resources are supported for cost analysis.
            <br />
            View our{" "}
            <a href="#" className="underline">
              docs
            </a>{" "}
            for a full list of what is supported.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
