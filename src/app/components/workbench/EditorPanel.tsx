import { memo, useMemo } from "react";
import { DEFAULT_TERMINAL_SIZE, TerminalTabs } from "./terminal/TerminalTabs";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PanelHeader } from "../ui/PanelHeader";
import { renderLogger } from "@/app/utils/logger";
import { PanelHeaderButton } from "../ui/PanelHeaderButton";

interface EditorPanelProps {
  files?: any;
  unsavedFiles?: Set<string>;
  editorDocument?: any;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  onEditorChange?: any;
  onEditorScroll?: any;
  onFileSelect?: (value?: string) => void;
  onFileSave?: any;
  onFileReset?: () => void;
}

const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const editorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    renderLogger.trace("EditorPanel");

    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }

      return editorDocument.filePath.split("/");
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      return (
        editorDocument !== undefined &&
        unsavedFiles?.has(editorDocument.filePath)
      );
    }, [editorDocument, unsavedFiles]);

    return (
      <PanelGroup direction="vertical">
        <Panel defaultSize={100} minSize={20}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={10} collapsible>
              <div className="flex flex-col border-r border-bolt-elements-borderColor h-full">
                <PanelHeader>
                  <div className="i-ph:tree-structure-duotone shrink-0" />
                  Files
                </PanelHeader>
              </div>
            </Panel>
            <Panel className="flex flex-col" defaultSize={80} minSize={20}>
              <PanelHeader className="overflow-x-auto">
                {activeFileSegments?.length && (
                  <div className="flex items-center flex-1 text-sm">
                    {activeFileUnsaved && (
                      <div className="flex gap-1 ml-auto -mr-1.5">
                        <PanelHeaderButton onClick={onFileSave}>
                          <div className="i-ph:floppy-disk-duotone" />
                          Save
                        </PanelHeaderButton>
                        <PanelHeaderButton onClick={onFileReset}>
                          <div className="i-ph:clock-counter-clockwise-duotone" />
                          Reset
                        </PanelHeaderButton>
                      </div>
                    )}
                  </div>
                )}
              </PanelHeader>
              <div className="h-full flex-1 overflow-hidden"></div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <TerminalTabs />
      </PanelGroup>
    );
  }
);
