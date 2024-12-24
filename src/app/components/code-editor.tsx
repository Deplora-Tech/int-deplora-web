"use client";

import React, { useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  ChevronDown,
  ChevronRight,
  FileIcon,
  FolderIcon,
  Terminal,
  Zap,
  Plus,
} from "lucide-react";

// Sample file content mapping
const FILE_CONTENT = {
  "index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`,
  "package-lock.json": `
{
  "name": "sample-project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`,
  "package.json": `
{
  "name": "sample-project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "vite"
  }
}`,
  "postcss.config.js": `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
  "tailwind.config.js": `
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
  "tsconfig.json": `
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true
  },
  "include": ["src/**/*"]
}`,
  "tsconfig.node.json": `
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
  "vite.config.ts": `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});`,
};

// File List
const FILES = Object.keys(FILE_CONTENT);

function TabsHeader() {
  return (
    <div className="border-b border-white/[0.02]">
      <div className="flex items-center px-4 py-1">
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
        </TabsList>
      </div>
    </div>
  );
}

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

function EditorContent({ selectedFile }: { selectedFile: keyof typeof FILE_CONTENT }) {
  const renderHighlightedContent = (content: string) => {
    // Split the content into lines
    const lines = content.split("\n");

    return lines.map((line, index) => (
      <div key={index}>
        {line.split(/(\s+|[{}[\]":,])/).map((token, i) => {
          if (/^\s+$/.test(token)) {
            return token; // Keep whitespace as is
          }
          if (
            token === "{" ||
            token === "}" ||
            token === "[" ||
            token === "]"
          ) {
            return (
              <span key={i} className="text-neutral-500">
                {token}
              </span>
            );
          }
          if (/^".*"$/.test(token)) {
            return (
              <span key={i} className="text-[#9CDCFE]">
                {token}
              </span>
            );
          }
          if (/^(true|false|null|\d+)$/.test(token)) {
            return (
              <span key={i} className="text-[#569CD6]">
                {token}
              </span>
            );
          }
          if (/:$/.test(token)) {
            return (
              <span key={i} className="text-neutral-500">
                {token}
              </span>
            );
          }
          return token;
        })}
      </div>
    ));
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="border-b border-white/[0.02] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileIcon className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-400">{selectedFile}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 text-xs text-neutral-600 select-none bg-white/[0.02]">
            {Array.from({
              length: FILE_CONTENT[selectedFile].split("\n").length,
            }).map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="p-4 pl-12 font-mono text-sm leading-6 whitespace-pre-wrap">
            {renderHighlightedContent(FILE_CONTENT[selectedFile])}
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
}

function PreviewContent() {
  return <div className="p-4 text-neutral-400">Preview content here</div>;
}

function FooterActions() {
  return (
    <div className="h-10 px-2 flex items-center justify-between border-t border-white/[0.02]">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-neutral-400 hover:text-white"
        >
          <Terminal className="w-3 h-3 mr-1" />
          Terminal
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-neutral-400 hover:text-white"
        >
          <Zap className="w-3 h-3 mr-1" />
          Deplora
        </Button>
      </div>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}

export function CodeEditor() {
  const [selectedFile, setSelectedFile] =
    useState<keyof typeof FILE_CONTENT>("tsconfig.node.json");

  return (
    <div className="gradient-border flex-1 flex flex-col min-w-0">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsHeader />
        <TabsContent value="code" className="flex-1 p-0 mt-0">
          <div className="flex h-full divide-x divide-white/[0.02]">
            <div className="w-64 flex flex-col border-r border-white/[0.02]">
              <FileList
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </div>
            <EditorContent selectedFile={selectedFile} />
          </div>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 mt-0">
          <PreviewContent />
        </TabsContent>
      </Tabs>
      <FooterActions />
    </div>
  );
}
