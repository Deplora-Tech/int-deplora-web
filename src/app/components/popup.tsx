"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, X, GitBranch, ExternalLink, GitFork } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "../hooks/session";
import { v4 } from "uuid";
import { GitRepo } from "../types/SessionType";

interface PopupProps {
  onClose: () => void;
}


export function Popup({ onClose }: PopupProps) {
  const [newRepo, setNewRepo] = useState("");
  const [projectList, setProjectList] = useState<GitRepo[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branchFetchingStatus, setBranchFetchingStatus] = useState("");
  const { client_id, setProject } = useSession();

  const handleRepoSelect = (repo: GitRepo) => {
    setProject(repo as GitRepo);
    console.log("Selected repo:", repo as GitRepo);
    onClose();
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/analyzer/projects?client_id=${client_id}`)
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to fetch projects");
          return [];
        }
        return res.json();
      }
      )

      .then((data) => {
        if (data && data.projects) {
          setProjectList(data.projects);
        } else {
          console.error("No projects found");
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }
    , []);

  const handleNewRepoChange = (value: string) => {
    setNewRepo(value);

    if (value.trim() != "") {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/analyzer/branches?repo_url=${value}`)
        .then((res) => {
          if (!res.ok) {
            setBranchFetchingStatus("Failed to fetch branches");
            setBranches([]);
            return;
          }
          return res.json();
        }
        )
        .then((data) => {
          if (data && data.branches) {
            setBranches(data.branches);
            setBranchFetchingStatus("");
          } else {
            setBranchFetchingStatus("No branches found");
            setBranches([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          setBranchFetchingStatus("Error fetching branches");
          setBranches([]);
        });
    }

    console.log("New repo value:", value);
  }


  const handleAddRepo = () => {
    if (selectedBranch && newRepo) {
      const project_id = v4();

      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/analyzer/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_url: newRepo,
          branch: selectedBranch,
          project_id: project_id,
          client_id: client_id,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Failed to add repo");
            setBranchFetchingStatus("Failed to add repo");
            return;
          }
          handleRepoSelect({
            id: project_id,
            repo_url: newRepo,
            branch: selectedBranch,
            name: String(newRepo).split("/").slice(-2).join("/"),
          });
        }
        )


        console.log("Adding new repo:", project_id)

    }
  }

  return (
    <AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative bg-neutral-900/90 p-8 rounded-xl shadow-2xl w-full max-w-md border border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Choose a Project</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-neutral-400 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {projectList.map((project, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left flex items-center gap-3 bg-neutral-900/50 border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800/50 transition-all group"
                  onClick={() => handleRepoSelect({
                    id: project.id,
                    repo_url: project.repo_url,
                    branch: project.branch,
                    name: String(project.repo_url).split("/").slice(-2).join("/"),
                  } as GitRepo)}
                >
                  <GitFork className="h-4 w-4 text-neutral-500 group-hover:text-cyan-400" />
                  {/* <span className="flex-1">{JSON.stringify(project)}</span> */}
                  <span className="text-xs text-neutral-500">{String(project.repo_url).split("/").slice(-2).join("/")}</span>
                  <GitBranch className="h-4 w-4 text-neutral-500 group-hover:text-cyan-400" />
                  <span className="text-xs text-neutral-500">{project.branch}</span>
                  {/* <ExternalLink className="h-4 w-4 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                </Button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <Input
                  value={newRepo}
                  onChange={(e) => handleNewRepoChange(e.target.value)}
                  placeholder="Enter a new repo link"
                  className="w-full bg-neutral-900/50 text-white border-neutral-800 focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-neutral-600"
                />
              </div>

              {/* Branch dropdown */}
              {branches.length > 0 && (
                <div className="relative">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-900/50 text-white border-neutral-800 placeholder:text-muted-foreground focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    defaultValue=""
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a branch
                    </option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {branchFetchingStatus && (
                <p className="text-sm text-red-500">{branchFetchingStatus}</p>
              )}

              <div className="flex justify-center">
                <Button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 group"
                  disabled={selectedBranch === null}
                  onClick={handleAddRepo}
                >
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Add New Repo
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-500">
                Press{" "}
                <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-800 rounded border border-neutral-700">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
