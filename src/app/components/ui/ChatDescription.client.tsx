"use client";

import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

// Simulated Tooltip Wrapper
function WithTooltip({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactElement;
}) {
  return <Tooltip title={tooltip}>{children}</Tooltip>;
}

export function ChatDescription() {
  const [initialDescription, setInitialDescription] = useState("Untitled Chat");
  const [currentDescription, setCurrentDescription] =
    useState(initialDescription);
  const [editing, setEditing] = useState(false);

  // Handlers for editing
  const toggleEditMode = () => setEditing((prev) => !prev);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCurrentDescription(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInitialDescription(currentDescription);
    setEditing(false);
  };

  const handleBlur = () => setEditing(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit(e);
    if (e.key === "Escape") setEditing(false);
  };

  if (!initialDescription) {
    return null; // Prevent rendering until description is set
  }

  return (
    <div className="flex items-center justify-center">
      {editing ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center"
        >
          {/* Editable Input */}
          <input
            type="text"
            className="bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary rounded px-2 mr-2 w-fit"
            autoFocus
            value={currentDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: `${Math.max(currentDescription.length * 8, 100)}px`,
            }}
          />
          {/* Save Button with Tooltip */}
          <WithTooltip tooltip="Save title">
            <div className="flex justify-between items-center p-2 rounded-md bg-bolt-elements-item-backgroundAccent">
              <button
                type="submit"
                className="scale-110 hover:text-bolt-elements-item-contentAccent"
              >
                ✅
              </button>
            </div>
          </WithTooltip>
        </form>
      ) : (
        <>
          {/* Display Current Description */}
          <span className="truncate text-bolt-elements-textPrimary">
            {currentDescription}
          </span>
          {/* Edit Button with Tooltip */}
          <WithTooltip tooltip="Rename chat">
            <div className="flex justify-between items-center p-2 rounded-md bg-bolt-elements-item-backgroundAccent ml-2">
              <button
                type="button"
                className="scale-110 hover:text-bolt-elements-item-contentAccent"
                onClick={toggleEditMode}
              >
                ✏️
              </button>
            </div>
          </WithTooltip>
        </>
      )}
    </div>
  );
}
