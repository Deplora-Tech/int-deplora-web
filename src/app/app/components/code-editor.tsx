'use client'

import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Separator } from "@/app/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { ChevronDown, ChevronRight, FileIcon, FolderIcon, Plus, Terminal, Zap } from 'lucide-react'

export function CodeEditor() {
  return (
    <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-sm min-w-0">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <div className="border-b border-neutral-800">
          <div className="flex items-center px-4">
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
        <TabsContent value="code" className="flex-1 p-0 mt-0">
          <div className="flex h-full divide-x divide-neutral-800">
            <div className="w-64 flex flex-col border-r border-neutral-800">
              <div className="p-2 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">Files</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 text-sm">
                  <div className="flex items-center gap-1 text-neutral-500 py-1">
                    <ChevronDown className="w-3 h-3" />
                    <FolderIcon className="w-3 h-3" />
                    <span>src</span>
                  </div>
                  <div className="pl-6 space-y-1 text-neutral-400">
                    {[
                      'index.html',
                      'package-lock.json',
                      'package.json',
                      'postcss.config.js',
                      'tailwind.config.js',
                      'tsconfig.json',
                      'tsconfig.node.json',
                      'vite.config.ts'
                    ].map((file) => (
                      <div 
                        key={file} 
                        className={`flex items-center gap-1 py-1 px-2 rounded group ${
                          file === 'tsconfig.node.json' 
                            ? 'text-blue-500 bg-blue-500/10' 
                            : 'hover:bg-neutral-800/50'
                        }`}
                      >
                        <FileIcon className="w-3 h-3" />
                        <span>{file}</span>
                        {file === 'tsconfig.node.json' && (
                          <Badge 
                            variant="outline" 
                            className="ml-auto h-4 border-neutral-700 text-[10px] px-1 text-neutral-400 group-hover:border-neutral-600"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
            <div className="flex-1 min-w-0">
              <div className="border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">tsconfig.node.json</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-40px)]">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 text-xs text-neutral-600 select-none bg-neutral-900/20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                  </div>
                  <pre className="p-4 pl-12 font-mono text-sm leading-6">
                    <code>
                      <span className="text-neutral-500">{"{"}</span>
                      <br />
                      <span className="text-neutral-500">  "</span>
                      <span className="text-[#9CDCFE]">compilerOptions</span>
                      <span className="text-neutral-500">": {"{"}</span>
                      <br />
                      <span className="text-neutral-500">    "</span>
                      <span className="text-[#9CDCFE]">composite</span>
                      <span className="text-neutral-500">": </span>
                      <span className="text-[#569CD6]">true</span>
                      <span className="text-neutral-500">,</span>
                      <br />
                      <span className="text-neutral-500">    "</span>
                      <span className="text-[#9CDCFE]">skipLibCheck</span>
                      <span className="text-neutral-500">": </span>
                      <span className="text-[#569CD6]">true</span>
                      <span className="text-neutral-500">,</span>
                      <br />
                      <span className="text-neutral-500">    "</span>
                      <span className="text-[#9CDCFE]">module</span>
                      <span className="text-neutral-500">": "</span>
                      <span className="text-[#CE9178]">ESNext</span>
                      <span className="text-neutral-500">",</span>
                      <br />
                      <span className="text-neutral-500">    "</span>
                      <span className="text-[#9CDCFE]">moduleResolution</span>
                      <span className="text-neutral-500">": "</span>
                      <span className="text-[#CE9178]">bundler</span>
                      <span className="text-neutral-500">",</span>
                      <br />
                      <span className="text-neutral-500">    "</span>
                      <span className="text-[#9CDCFE]">allowSyntheticDefaultImports</span>
                      <span className="text-neutral-500">": </span>
                      <span className="text-[#569CD6]">true</span>
                      <br />
                      <span className="text-neutral-500">  {"}"}</span>
                      <span className="text-neutral-500">,</span>
                      <br />
                      <span className="text-neutral-500">  "</span>
                      <span className="text-[#9CDCFE]">include</span>
                      <span className="text-neutral-500">": [</span>
                      <span className="text-[#CE9178]">"vite.config.ts"</span>
                      <span className="text-neutral-500">]</span>
                      <br />
                      <span className="text-neutral-500">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 mt-0">
          <div className="p-4 text-neutral-400">Preview content here</div>
        </TabsContent>
      </Tabs>
      <div className="h-10 px-2 flex items-center justify-between border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-neutral-400 hover:text-white">
            <Terminal className="w-3 h-3 mr-1" />
            Terminal
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-neutral-400 hover:text-white">
            <Zap className="w-3 h-3 mr-1" />
            Deplora
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

