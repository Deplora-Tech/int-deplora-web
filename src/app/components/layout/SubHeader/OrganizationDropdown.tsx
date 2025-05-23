"use client";

import { useState } from "react";
import { Building, Plus, ChevronDown, Settings } from "lucide-react";
import { Organization, useOrganizations } from "@/app/hooks/organizations";
import { Dropdown } from "../../ui/dropdown";
import { DropdownForm } from "../../ui/dropdown-form";
import { OrganizationSettings } from "./OrganizationSettings";
import { OrganizationModal } from "../../ui/modal";

interface OrganizationDropdownProps {
  className?: string;
}

export function OrganizationDropdown({ className }: OrganizationDropdownProps) {
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [selectedOrgForEdit, setSelectedOrgForEdit] =
    useState<Organization | null>(null);
  const { org, setOrg, organizations, createOrg, updateOrg } =
    useOrganizations();
  const handleOrgSelect = (selectedOrg: Organization) => {
    setOrg(selectedOrg);
    setIsOrgDropdownOpen(false);
    localStorage.setItem("org", selectedOrg.id);
  };

  const handleAddOrg = () => {
    // Create a new empty organization template
    const newOrgTemplate: Partial<Organization> = {
      name: "",
      description: "",
      client_id: "",
      environment_variables: {},
      regions: [],
      deployment_settings: {
        default_region: "",
        auto_deploy: false,
      },
    };

    setSelectedOrgForEdit(newOrgTemplate as Organization);
    setIsEditingOrg(true);
    setIsOrgDropdownOpen(false);
  };

  const handleAddNewOrg = async (orgName: string) => {
    if (orgName.trim() === "") return;

    try {
      await createOrg(orgName, "");
      setIsAddingOrg(false);
      setIsOrgDropdownOpen(false);
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent,
    organization?: Organization
  ) => {
    if (e.key === "Enter" && organization) {
      handleOrgSelect(organization);
    } else if (e.key === "Escape") {
      setIsOrgDropdownOpen(false);
    }
  };
  const handleEditOrg = (selectedOrg: Organization) => {
    setSelectedOrgForEdit(selectedOrg);
    setIsEditingOrg(true);
    setIsOrgDropdownOpen(false); // Close the dropdown when editing
  };

  const handleSaveOrgSettings = async (updatedOrg: Organization) => {
    try {
      // If the organization has an ID, it's an update; otherwise, it's a new org
      if (updatedOrg.id) {
        // Update existing organization
        await updateOrg(updatedOrg.id, updatedOrg);
      } else {
        // Create new organization
        await createOrg(updatedOrg.name, updatedOrg.description || "");
      }

      setIsEditingOrg(false);
      setSelectedOrgForEdit(null);
    } catch (error) {
      console.error("Error saving organization:", error);
      throw error;
    }
  };

  const trigger = (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500/10 to-teal-400/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
      <Building className="w-4 h-4 text-blue-400" />
      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
        {org?.name || "Select Organization"}
      </span>
      <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
    </div>
  );

  return (
    <>
      <Dropdown
        trigger={trigger}
        isOpen={isOrgDropdownOpen}
        onOpenChange={setIsOrgDropdownOpen}
        className={`group ${className}`}
        id="org-dropdown"
        focusFirstItemOnOpen={true}
      >
        <div className="w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-md shadow-lg overflow-hidden">
          <div className="py-1">
            {organizations && organizations.length > 0 ? (
              organizations.map((organization) => (
                <div
                  key={organization.id}
                  className="px-4 py-2 text-sm text-white/80 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-teal-400/20 cursor-pointer flex justify-between items-center"
                  role="menuitem"
                >
                  <div
                    className="flex-grow"
                    onClick={() => handleOrgSelect(organization)}
                    onKeyDown={(e) => handleKeyDown(e, organization)}
                    tabIndex={0}
                  >
                    {organization.name}
                  </div>
                  <button
                    className="p-1 text-white/50 hover:text-blue-400 focus:outline-none focus:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditOrg(organization);
                    }}
                    aria-label={`Edit ${organization.name} settings`}
                    title="Organization Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-white/60 italic">
                No organizations found
              </div>
            )}{" "}
            {!isAddingOrg ? (
              <div
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-teal-400/10 cursor-pointer border-t border-white/10"
                onClick={handleAddOrg}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddOrg();
                }}
                tabIndex={0}
                role="menuitem"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Organization</span>
              </div>
            ) : (
              <DropdownForm
                title="Add New Organization"
                inputPlaceholder="Organization Name"
                submitButtonText="Add"
                onSubmit={handleAddNewOrg}
                onCancel={() => setIsAddingOrg(false)}
                className="border-t border-white/10"
              />
            )}
          </div>
        </div>
      </Dropdown>

      {/* Organization Settings Modal */}
      {isEditingOrg && selectedOrgForEdit && (
        <OrganizationModal
          isOpen={isEditingOrg}
          onClose={() => {
            setIsEditingOrg(false);
            setSelectedOrgForEdit(null);
          }}
          selectedOrg={selectedOrgForEdit}
          onSave={handleSaveOrgSettings}
        />
      )}
    </>
  );
}
