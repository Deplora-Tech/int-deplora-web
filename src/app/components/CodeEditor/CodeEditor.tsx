"use client";

import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent } from "../ui/tabs";
import { ChevronDown, FileIcon, FolderIcon } from "lucide-react";
import { detectFileType } from "../../lib/editor";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { TabsHeader } from "./TabHeader";
import { FooterActions } from "./FooterActions";
import { useMessages } from "../../../app/hooks/messages";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import PreviewContent from "./PreviewContent";
import { useSession } from "@/app/hooks/session";
import CostDashboard from "../CostCalculation/CostDashboard";
import { mockCostData } from "@/app/data/mockCostData";
import { GitRepo } from "@/app/types/SessionType";

type FileTree = {
  [key: string]: FileTree | string;
};

// Function to build a file tree structure
function buildFileTree(files: string[], project: GitRepo | null): FileTree {
  let tree: FileTree = {};
  files.forEach((path) => {
    const parts = path.split("/");
    let current = tree;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? path : {};
      }
      current = current[part] as FileTree;
    });
  });

  tree = {
    [project?.name || "project"]: tree,
  };
  return tree;
}

function renderFileTree(
  tree: FileTree,
  openFolders: Record<string, boolean>,
  toggleFolder: (folderPath: string) => void,
  selectedFile: string,
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>,
  parentPath = ""
) {
  return Object.entries(tree).map(([key, value]) => {
    const fullPath = parentPath ? `${parentPath}/${key}` : key;
    const isFolder = typeof value !== "string";
    const isOpen = openFolders[fullPath] || false;

    return (
      <div key={fullPath} className="pl-4">
        {isFolder ? (
          <div
            className="flex items-center gap-1 cursor-pointer text-neutral-500 py-1"
            onClick={() => toggleFolder(fullPath)}
          >
            {isOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <FolderIcon className="w-3 h-3" />
            <span
              className="max-w-[130px] truncate overflow-hidden text-ellipsis"
              title={key} // This adds a tooltip that shows on hover
            >
              {key}
            </span>
          </div>
        ) : (
          <div
            key={key}
            onClick={() => setSelectedFile(value as string)}
            className={`flex items-center gap-1 py-1 px-2 rounded cursor-pointer group ${
              value === selectedFile
                ? "text-blue-500 bg-blue-500/10"
                : "hover:bg-white/[0.02]"
            }`}
          >
            <FileIcon className="w-3 h-3" />
            <span>{key}</span>
          </div>
        )}
        {isFolder && isOpen && (
          <div className="pl-4">
            {renderFileTree(
              value as FileTree,
              openFolders,
              toggleFolder,
              selectedFile,
              setSelectedFile,
              fullPath
            )}
          </div>
        )}
      </div>
    );
  });
}

export function FileList({
  fileContent,
  selectedFile,
  setSelectedFile,
}: {
  fileContent: Record<string, string>;
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { project } = useSession();
  const filePaths = Object.keys(fileContent);
  const fileTree = buildFileTree(filePaths, project);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  return (
    <div className="flex-1 p-2 text-sm">
      {/* <div className="flex items-center gap-1 text-neutral-500 py-1">
        <ChevronDown className="w-3 h-3" />
        <FolderIcon className="w-3 h-3" />
        <span>src</span>
      </div> */}
      <div className="space-y-1 text-neutral-400">
        {renderFileTree(
          fileTree,
          openFolders,
          toggleFolder,
          selectedFile,
          setSelectedFile
        )}
      </div>
    </div>
  );
}

function EditorContent({
  selectedFile,
  fileContent,
  setFileContent,
}: {
  selectedFile: string;
  fileContent: Record<string, string>;
  setFileContent: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const content = fileContent[selectedFile];
  const fileType = detectFileType(selectedFile);
  const { session_id } = useSession();
  const [saving, setSaving] = useState(false);

  const handleContentChange = async (newContent: string) => {
    try {
      setSaving(true);
      setFileContent({
        ...fileContent,
        [selectedFile]: newContent,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update-file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id,
            file_path: selectedFile,
            file_content: newContent,
          }),
        }
      );

      if (!res.ok) {
        console.error("Failed to update file");
        return;
      }

      console.log("File updated successfully");
    } catch (error) {
      console.error("Error updating file:", error);
    } finally {
      // sleep 1 sec before setting saving to false
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaving(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100%-40px)] w-full bg-gray-950">
      <div className="relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 text-xs text-neutral-600 select-none bg-white/[0.02] gap-[2px]">
          {content &&
            Array.from({ length: content.split("\n").length }).map((_, i) => (
              <div key={i} style={{ fontSize: "0.75rem" }}>
                {i + 1}
              </div>
            ))}
        </div>
        <div className="pl-12 ">
          <Editor
            value={content}
            onValueChange={handleContentChange}
            highlight={(code) =>
              highlight(
                code,
                languages[fileType] || languages.js,
                fileType
              ).replace(/<span class="token punctuation">(.*?)<\/span>/g, "$1")
            }
            style={{
              paddingTop: 1,
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              backgroundColor: "none",
              color: "#d4d4d4",
              borderColor: "transparent",
            }}
            className="bg-none text-gray-400 focus:outline-none border-none hover:border-none"
          />
        </div>
      </div>
      <div className="w-full bg-gray-700 text-xs absolute bottom-0 left-0 right-0 text-right px-2">
        {saving && "Saving"}
      </div>
    </ScrollArea>
  );
}

export function CodeEditor({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { fileContent, setFileContent } = useMessages();
  const [selectedFile, setSelectedFile] = useState<string>(
    fileContent &&
      typeof fileContent === "object" &&
      Object.keys(fileContent).length > 0
      ? (Object.keys(fileContent)[0] as keyof typeof fileContent)
      : ""
  );

  return (
    <div className="gradient-border flex-1 flex flex-col min-w-0 h-[80vh]">
      <Tabs defaultValue="code" className="flex-1 flex flex-col h-[76vh]">
        <TabsHeader setIsModalOpen={setIsModalOpen} />
        <div className="absolute top-0 right-10 h-[0.6px] w-full bg-gradient-to-r from-transparent via-blue-500 via-50% via-teal-400 to-transparent" />
        <TabsContent value="code" className="flex-1 p-0 mt-0 h-[76vh]">
          <div className="flex h-full divide-x divide-white/[0.02]">
            <div className="w-64 flex flex-col border-r border-white/[0.02]">
              {fileContent && Object.entries(fileContent).length > 0 && (
                <FileList
                  fileContent={fileContent}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
              )}
            </div>

            <EditorContent
              selectedFile={selectedFile}
              fileContent={fileContent}
              setFileContent={setFileContent}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="preview"
          className="flex-1 mt-0 max-h-[76vh] overflow-auto "
        >
          <PreviewContent />
        </TabsContent>
        <TabsContent
          value="cost_analysis"
          className="flex-1 mt-0 max-h-[76vh] overflow-auto "
        >
          <CostDashboard costData={mockCostData} />
        </TabsContent>
      </Tabs>
      <FooterActions />
    </div>
  );
}
