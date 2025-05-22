"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Key,
  Save,
  X,
  Plus,
  Trash2,
  Globe,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Organization, useOrganizations } from "@/app/hooks/organizations";
import { Tabs } from "../../ui/tabs";

interface OrganizationSettingsProps {
  organization: Organization;
  onClose: () => void;
  onSave: (orgData: Organization) => Promise<void>;
}

export function OrganizationSettings({
  organization,
  onClose,
  onSave,
}: OrganizationSettingsProps) {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [name, setName] = useState(organization?.name || "");
  const [description, setDescription] = useState(
    organization?.description || ""
  );
  const [apiKey, setApiKey] = useState(organization?.api_key || "");
  const [secretKey, setSecretKey] = useState(organization?.secret_key || "");
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>(
    Object.entries(organization?.environment_variables || {}).map(
      ([key, value]) => ({ key, value })
    ) || []
  );
  const [regions, setRegions] = useState<string[]>(organization?.regions || []);
  const [newRegion, setNewRegion] = useState("");
  const [defaultRegion, setDefaultRegion] = useState(
    organization?.deployment_settings?.default_region || ""
  );
  const [autoDeploy, setAutoDeploy] = useState(
    organization?.deployment_settings?.auto_deploy || false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (organization) {
      setName(organization.name || "");
      setDescription(organization.description || "");
      setApiKey(organization.api_key || "");
      setSecretKey(organization.secret_key || "");
      setEnvVars(
        Object.entries(organization.environment_variables || {}).map(
          ([key, value]) => ({ key, value })
        ) || []
      );
      setRegions(organization.regions || []);
      setDefaultRegion(organization.deployment_settings?.default_region || "");
      setAutoDeploy(organization.deployment_settings?.auto_deploy || false);
    }
  }, [organization]);
  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    const updatedEnvVars = [...envVars];
    updatedEnvVars.splice(index, 1);
    setEnvVars(updatedEnvVars);
  };

  const updateEnvVar = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedEnvVars = [...envVars];
    updatedEnvVars[index][field] = value;
    setEnvVars(updatedEnvVars);
  };

  const addRegion = () => {
    if (newRegion && !regions.includes(newRegion)) {
      setRegions([...regions, newRegion]);
      setNewRegion("");
    }
  };

  const removeRegion = (region: string) => {
    setRegions(regions.filter((r) => r !== region));
    if (defaultRegion === region) {
      setDefaultRegion("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    // Convert envVars array to object
    const environmentVariables: Record<string, string> = {};
    for (const { key, value } of envVars) {
      if (key.trim()) {
        environmentVariables[key] = value;
      }
    }

    setLoading(true);
    try {
      await onSave({
        ...organization,
        name,
        description,
        api_key: apiKey,
        secret_key: secretKey,
        environment_variables: environmentVariables,
        regions,
        deployment_settings: {
          default_region: defaultRegion,
          auto_deploy: autoDeploy,
        },
      });
      onClose();
    } catch (err) {
      console.error("Error saving organization:", err);
      setError("Failed to update organization settings");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-black backdrop-blur-md p-4 w-full h-full max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">
            {organization.id ? "Organization Settings" : "New Organization"}
          </h2>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="mb-4 border-b border-white/10">
        <div className="flex space-x-4">
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === "general"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === "api"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("api")}
          >
            API Keys
          </button>
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === "env"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("env")}
          >
            Environment
          </button>
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === "deploy"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("deploy")}
          >
            Deployment
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* General Settings Tab */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="org-name"
                  className="text-sm text-white/80 font-medium"
                >
                  Organization Name
                </label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border-white/20 text-white"
                  placeholder="Enter organization name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="org-description"
                  className="text-sm text-white/80 font-medium"
                >
                  Description
                </label>
                <Input
                  id="org-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/60 border-white/20 text-white"
                  placeholder="Enter organization description"
                />
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === "api" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="api-key"
                  className="text-sm text-white/80 font-medium flex items-center gap-2"
                >
                  <Key className="w-4 h-4 text-blue-400" />
                  API Key
                </label>
                <Input
                  id="api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-black/60 border-white/20 text-white"
                  placeholder="Enter API key"
                  type="password"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="secret-key"
                  className="text-sm text-white/80 font-medium flex items-center gap-2"
                >
                  <Key className="w-4 h-4 text-blue-400" />
                  Secret Key
                </label>
                <Input
                  id="secret-key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-black/60 border-white/20 text-white"
                  placeholder="Enter secret key"
                  type="password"
                />
              </div>
            </div>
          )}

          {/* Environment Variables Tab */}
          {activeTab === "env" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white">
                  Environment Variables
                </h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={addEnvVar}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs px-2 py-1 rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Variable
                </Button>
              </div>

              {envVars.length === 0 ? (
                <div className="text-sm text-white/60 italic py-2">
                  No environment variables defined
                </div>
              ) : (
                <div className="space-y-3">
                  {envVars.map((envVar, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={envVar.key}
                        onChange={(e) =>
                          updateEnvVar(index, "key", e.target.value)
                        }
                        className="flex-1 bg-black/60 border-white/20 text-white text-sm"
                        placeholder="KEY"
                      />
                      <Input
                        value={envVar.value}
                        onChange={(e) =>
                          updateEnvVar(index, "value", e.target.value)
                        }
                        className="flex-1 bg-black/60 border-white/20 text-white text-sm"
                        placeholder="value"
                        type="password"
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => removeEnvVar(index)}
                        className="text-white/60 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Deployment Settings Tab */}
          {activeTab === "deploy" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Deployment Regions
                  </h3>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="flex-1 bg-black/60 border-white/20 text-white"
                    placeholder="Enter region (e.g., us-east-1)"
                  />
                  <Button
                    type="button"
                    onClick={addRegion}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                  >
                    Add
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <div
                      key={region}
                      className="bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-1 text-xs flex items-center gap-1 text-white/80"
                    >
                      <span>{region}</span>
                      <button
                        type="button"
                        onClick={() => removeRegion(region)}
                        className="text-white/60 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {regions.length === 0 && (
                    <div className="text-sm text-white/60 italic py-1">
                      No regions defined
                    </div>
                  )}
                </div>
              </div>

              {regions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-white/80 font-medium">
                    Default Deployment Region
                  </label>
                  <select
                    value={defaultRegion}
                    onChange={(e) => setDefaultRegion(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 text-white rounded-md p-2"
                  >
                    <option value="">Select default region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="auto-deploy"
                  checked={autoDeploy}
                  onChange={(e) => setAutoDeploy(e.target.checked)}
                  className="rounded bg-black/60 border-white/30 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="auto-deploy" className="text-sm text-white/80">
                  Enable auto-deployment
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            disabled={loading}
          >
            Cancel
          </Button>{" "}
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : organization.id
              ? "Save Settings"
              : "Create Organization"}
          </Button>
        </div>
      </form>
    </div>
  );
}
