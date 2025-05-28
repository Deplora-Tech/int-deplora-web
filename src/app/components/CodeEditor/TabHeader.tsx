import { TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowUpRight, AlertTriangle, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useSession } from "../../hooks/session";
import { GitCommit } from "lucide-react";
import { useMessages } from "@/app/hooks/messages";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface TabsHeaderProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

interface EnvVariable {
  description: string;
  type: string;
  default?: any;
  sensitive?: boolean;
}

interface EnvVariablesResponse {
  user_vars: {
    [key: string]: EnvVariable;
  };
  common_vars: {
    [key: string]: EnvVariable;
  };
  status: string;
}

export function TabsHeader({ setIsModalOpen }: TabsHeaderProps) {
  const { session_id } = useSession();
  const { setMessageHistory } = useMessages();

  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [envVariables, setEnvVariables] = useState<EnvVariablesResponse | null>(
    null
  );
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDeploy = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-env/${session_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to check environment");
          return;
        }
        return res.json();
      })
      .then((data: EnvVariablesResponse) => {
        console.log("Environment check result:", data);

        // Initialize env values with defaults
        const initialValues: Record<string, string> = {};

        // Get user_vars defaults
        if (data && data.user_vars) {
          Object.entries(data.user_vars).forEach(([key, variable]) => {
            if (variable.default !== undefined) {
              initialValues[key] = String(variable.default);
            } else {
              initialValues[key] = "";
            }
          });
        }

        // Get common_vars defaults
        if (data && data.common_vars) {
          Object.entries(data.common_vars).forEach(([key, variable]) => {
            if (variable.default !== undefined) {
              initialValues[key] = String(variable.default);
            } else {
              initialValues[key] = "";
            }
          });
        }

        setEnvValues(initialValues);
        setEnvVariables(data);
        setEnvModalOpen(true);
      })
      .catch((err) => {
        console.error("Error checking environment:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Check if all required variables have values
  const areAllVarsSet = () => {
    if (!envVariables) return false;

    // Check user_vars
    for (const key in envVariables.user_vars) {
      if (!envValues[key]) return false;
    }

    // Check common_vars
    for (const key in envVariables.common_vars) {
      if (!envValues[key]) return false;
    }

    return true;
  };

  // Sort variables with empty values first
  const getSortedVariables = (): {
    empty: [string, EnvVariable][];
    filled: [string, EnvVariable][];
  } => {
    if (!envVariables) return { empty: [], filled: [] };

    const allVars = { ...envVariables.user_vars, ...envVariables.common_vars };
    const empty: [string, EnvVariable][] = [];
    const filled: [string, EnvVariable][] = [];

    Object.entries(allVars).forEach(([key, variable]) => {
      if (!envValues[key]) {
        empty.push([key, variable]);
      } else {
        filled.push([key, variable]);
      }
    });

    return { empty, filled };
  };

  const handleInputChange = (key: string, value: string) => {
    setEnvValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper to check if the variable is a number type
  const isNumericType = (type: string) => {
    return type === "number" || type.includes("int") || type.includes("float");
  };

  const handleDeploy = () => {
    // Close the env modal if it's open
    setEnvModalOpen(false);

    // Show the deployment modal popup
    setIsModalOpen(true);

    // fill envVariables with envValues before posting.
    const filledEnvVariables: Record<string, EnvVariable> = {};
    if (envVariables) {
      // Combine user_vars and common_vars
      const allVars = {
        ...envVariables.user_vars,
        ...envVariables.common_vars,
      };
      Object.entries(allVars).forEach(([key, variable]) => {
        filledEnvVariables[key] = {
          ...variable,
          default: envValues[key] || variable.default || "",
        };
      });
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ env_variables: filledEnvVariables, session_id }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to post status");
          return;
        }
        setMessageHistory();
      })
      .catch((err) => {
        console.error("Error posting status:", err);
      });
  };

  return (
    <div className="border-b border-white/[0.02]">
      <div className="flex justify-between px-4 py-1">
        <TabsList className="h-9 bg-transparent border-none">
          <TabsTrigger
            value="code"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
          >
            Code
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="cost_analysis"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
          >
            Cost
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2 p-2">
          <Button
            onClick={handleDeploy}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white grayscale"
          >
            <GitCommit className="w-4 h-4 mr-2" />
            Commit to Repository
          </Button>

          <Button
            onClick={handleStartDeploy}
            size="sm"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            {isLoading ? "Checking..." : "Deploy"}
          </Button>
        </div>
      </div>

      {/* Environment Variables Modal */}
      <Dialog.Root open={envModalOpen} onOpenChange={setEnvModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-5xl max-h-[85vh] transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-white/10 rounded-xl shadow-lg focus:outline-none overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <Dialog.Title className="text-xl font-medium text-white">
                Configure Environment Variables
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-400">
                Set values for deployment environment variables. Empty fields
                are shown at the top.
              </Dialog.Description>
              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 text-white/60 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
              {envVariables && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {getSortedVariables().empty.map(([key, variable]) => (
                      <div
                        key={key}
                        className="border border-red-500/30 rounded-lg p-4 bg-red-500/5"
                      >
                        <div className="flex justify-between">
                          <label
                            htmlFor={key}
                            className="block text-sm font-medium text-white mb-1"
                          >
                            {key}
                          </label>
                          {variable.sensitive && (
                            <span className="text-xs text-red-400 rounded-md px-1">
                              Sensitive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {variable.description}
                          {variable.type.includes("list") && (
                            <span className="ml-1 text-blue-400">
                              (comma-separated values)
                            </span>
                          )}
                        </p>
                        {variable.type.includes("list") ? (
                          <input
                            type="text"
                            id={key}
                            value={envValues[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            placeholder={
                              variable.default !== undefined
                                ? Array.isArray(variable.default)
                                  ? variable.default.join(", ")
                                  : String(variable.default)
                                : ""
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : isNumericType(variable.type) ? (
                          <input
                            type="number"
                            id={key}
                            value={envValues[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            placeholder={
                              variable.default !== undefined
                                ? String(variable.default)
                                : ""
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <input
                            type={variable.sensitive ? "password" : "text"}
                            id={key}
                            value={envValues[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            placeholder={
                              variable.default !== undefined
                                ? String(variable.default)
                                : ""
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Variables with values */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {getSortedVariables().filled.map(([key, variable]) => (
                      <div
                        key={key}
                        className="border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between">
                          <label
                            htmlFor={key}
                            className="block text-sm font-medium text-white mb-1"
                          >
                            {key}
                          </label>
                          {variable.sensitive && (
                            <span className="text-xs text-yellow-500 rounded-md px-1">
                              Sensitive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {variable.description}
                          {variable.type.includes("list") && (
                            <span className="ml-1 text-blue-400">
                              (comma-separated values)
                            </span>
                          )}
                        </p>
                        {variable.type.includes("list") ? (
                          <input
                            type="text"
                            id={key}
                            value={envValues[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            placeholder={
                              variable.default !== undefined
                                ? Array.isArray(variable.default)
                                  ? variable.default.join(", ")
                                  : String(variable.default)
                                : ""
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : isNumericType(variable.type) ? (
                          <input
                            type="number"
                            id={key}
                            value={envValues[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            placeholder={
                              variable.default !== undefined
                                ? String(variable.default)
                                : ""
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <input
                            type={variable.sensitive ? "password" : "text"}
                            id={key}
                            value={envValues[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            placeholder={
                              variable.default !== undefined
                                ? String(variable.default)
                                : ""
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900 flex justify-between items-center">
              {!areAllVarsSet() && (
                <div
                  className="flex items-center text-yellow-500 text-sm"
                  role="alert"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" aria-hidden="true" />
                  Some variables are not set
                </div>
              )}
              {areAllVarsSet() && (
                <div className="text-green-500 text-sm" role="status">
                  All variables are set
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => setEnvModalOpen(false)}
                  size="sm"
                  variant="ghost"
                  className="text-white"
                >
                  Cancel
                </Button>

                {areAllVarsSet() ? (
                  <Button
                    onClick={handleDeploy}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-teal-400 text-white"
                  >
                    Deploy
                  </Button>
                ) : (
                  <Button
                    onClick={handleDeploy}
                    size="sm"
                    className="bg-gradient-to-r from-yellow-500 to-red-400 text-white"
                  >
                    Deploy Anyway
                  </Button>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
