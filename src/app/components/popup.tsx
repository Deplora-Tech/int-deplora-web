"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, X, GitBranch, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupProps {
  onClose: () => void;
  onRepoSelect: (repo: string) => void;
  selectedRepo: string;
}

export function Popup({ onClose, onRepoSelect, selectedRepo }: PopupProps) {
  const [newRepo, setNewRepo] = useState("");
  const [projectList, setProjectList] = useState<string[]>([
    "Project A",
    "Project B",
  ]);

  const handleRepoSelect = (repo: string) => {
    onRepoSelect(repo);
    onClose();
  };

  const handleNewRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRepo.trim()) {
      setProjectList([...projectList, newRepo]);
      onRepoSelect(newRepo);
      setNewRepo("");
      onClose();
    }
  };

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
                  onClick={() => handleRepoSelect(project)}
                >
                  <GitBranch className="h-4 w-4 text-neutral-500 group-hover:text-cyan-400" />
                  <span className="flex-1">{project}</span>
                  <ExternalLink className="h-4 w-4 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>

            <form onSubmit={handleNewRepoSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <Input
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                  placeholder="Enter a new repo link"
                  className="w-full bg-neutral-900/50 text-white border-neutral-800 focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-neutral-600"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 group"
                >
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Add New Repo
                </Button>
              </div>
            </form>

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
