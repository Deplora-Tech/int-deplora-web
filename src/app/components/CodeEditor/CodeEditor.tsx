"use client";

import React, { useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import { ChevronDown, FileIcon, FolderIcon } from "lucide-react";
import { detectFileType, FILE_CONTENT } from "../../lib/editor";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; // Optional: Include a Prism theme for styling
import { TabsHeader } from "./TabHeader";
import { FooterActions } from "./FooterActions";
import { PreviewContent } from "./PreviewContent";

// File List
const FILES = Object.keys(FILE_CONTENT);

function FileList({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: string;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<keyof typeof FILE_CONTENT>
  >;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 text-sm">
        <div className="flex items-center gap-1 text-neutral-500 py-1">
          <ChevronDown className="w-3 h-3" />
          <FolderIcon className="w-3 h-3" />
          <span>src</span>
        </div>
        <div className="pl-6 space-y-1 text-neutral-400">
          {FILES.map((file) => (
            <div
              key={file}
              onClick={() => setSelectedFile(file as keyof typeof FILE_CONTENT)}
              className={`flex items-center gap-1 py-1 px-2 rounded cursor-pointer group ${
                file === selectedFile
                  ? "text-blue-500 bg-blue-500/10"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <FileIcon className="w-3 h-3" />
              <span>{file}</span>
              {file === selectedFile && (
                <Badge
                  variant="outline"
                  className="ml-auto h-4 border-white/[0.05] text-[10px] px-1 text-neutral-400 group-hover:border-white/[0.1]"
                >
                  Active
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

function EditorContent({
  selectedFile,
  fileContent,
  setFileContent,
}: {
  selectedFile: keyof typeof FILE_CONTENT;
  fileContent: typeof FILE_CONTENT;
  setFileContent: React.Dispatch<React.SetStateAction<typeof FILE_CONTENT>>;
}) {
  const content = fileContent[selectedFile];
  const fileType = detectFileType(selectedFile);

  const handleContentChange = (newContent: string) => {
    setFileContent({
      ...fileContent,
      [selectedFile]: newContent,
    });
  };

  return (
    <ScrollArea className="h-[calc(100%-40px)] w-full bg-gradient-to-b from-[#121212] to-black">
      <div className="relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 text-xs text-neutral-600 select-none bg-white/[0.02] gap-[2px]">
          {Array.from({ length: content.split("\n").length }).map((_, i) => (
            <div key={i} style={{ fontSize: "0.75rem" }}>
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code Editor */}
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
              backgroundColor: "none", // Set to a neutral background
              color: "#d4d4d4",
              borderColor: "transparent",
            }}
            className="bg-none text-gray-400 focus:outline-none border-none hover:border-none"
          />
        </div>
      </div>
    </ScrollArea>
  );
}

export function CodeEditor() {
  const [selectedFile, setSelectedFile] =
    useState<keyof typeof FILE_CONTENT>("Dockerfile");
  const [fileContent, setFileContent] = useState(FILE_CONTENT);

  return (
    <div className="gradient-border flex-1 flex flex-col min-w-0 h-[80vh]">
      <Tabs defaultValue="code" className="flex-1 flex flex-col h-[76vh]">
        <TabsHeader />
        <div className="absolute top-0 right-10 h-[0.6px] w-full bg-gradient-to-r from-transparent via-blue-500 via-50% via-teal-400 to-transparent" />
        <TabsContent value="code" className="flex-1 p-0 mt-0 h-[76vh]">
          <div className="flex h-full divide-x divide-white/[0.02]">
            <div className="w-64 flex flex-col border-r border-white/[0.02]">
              <FileList
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </div>

            <EditorContent
              selectedFile={selectedFile}
              fileContent={fileContent}
              setFileContent={setFileContent}
            />
          </div>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 mt-0">
          <PreviewContent/>
        </TabsContent>
      </Tabs>
      <FooterActions />
    </div>
  );
}
