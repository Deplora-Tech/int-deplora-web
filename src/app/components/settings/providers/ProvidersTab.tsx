import React, { useEffect, useState } from "react";

// Import a default fallback icon
import { Switch } from "../../ui/Switch";

export default function ProvidersTab() {
  const { providers, updateProviderSettings, isLocalModel } = {
    providers: {},
    updateProviderSettings: (provider: string, settings: any) => {},
    isLocalModel: false,
  };
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);

  // Load base URLs from cookies
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-bolt-elements-background-depth-4 relative px-2 py-1.5 rounded-md focus:outline-none placeholder-bolt-elements-textTertiary text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary border border-bolt-elements-borderColor"
        />
      </div>
      {filteredProviders.map((provider) => (
        <div
          key={provider.name}
          className="flex flex-col mb-2 provider-item hover:bg-bolt-elements-bg-depth-3 p-4 rounded-lg border border-bolt-elements-borderColor "
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={`/icons/${provider.name}.svg`} // Attempt to load the specific icon
                onError={(e) => {
                  // Fallback to default icon on error
                  e.currentTarget.src = "/icons/default.svg";
                }}
                alt={`${provider.name} icon`}
                className="w-6 h-6 dark:invert"
              />
              <span className="text-bolt-elements-textPrimary">
                {provider.name}
              </span>
            </div>
            <Switch
              className="ml-auto"
              checked={provider.settings.enabled}
              onCheckedChange={(enabled) => {
                updateProviderSettings(provider.name, {
                  ...provider.settings,
                  enabled,
                });
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
