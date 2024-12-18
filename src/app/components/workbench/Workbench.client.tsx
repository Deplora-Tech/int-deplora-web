import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { JSX, memo, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { EditorPanel } from "./EditorPanel";
import Cookies from "js-cookie";
import { cubicEasingFn } from "@/app/utils/easings";
import { Slider, SliderOptions } from "../ui/Slider";
import { renderLogger } from "@/app/utils/logger";
import { classNames } from "@/app/utils/classNames";
import { PanelHeaderButton } from "../ui/PanelHeaderButton";
import { IconButton } from "../ui/IconButton";

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

const viewTransition = { ease: cubicEasingFn };

const sliderOptions: SliderOptions<any> = {
  left: {
    value: "code",
    text: "Code",
  },
  right: {
    value: "preview",
    text: "Preview",
  },
};

const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: "var(--workbench-width)",
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const Workbench = memo(
  ({ chatStarted, isStreaming }: WorkspaceProps) => {
    renderLogger.trace("Workbench");

    const [isSyncing, setIsSyncing] = useState(false);

    const hasPreview = false;
    const showWorkbench = true;
    const selectedFile = "";
    const currentDocument = {};
    const unsavedFiles = "";
    const files = "";
    const selectedView = "preview";

    const isSmallViewport = false;

    const setSelectedView = (view: any) => {};

    useEffect(() => {
      if (hasPreview) {
        setSelectedView("preview");
      }
    }, [hasPreview]);

    useEffect(() => {}, [files]);

    const onFileSelect = useCallback((filePath: string | undefined) => {}, []);

    const onFileSave = useCallback(() => {}, []);

    const onFileReset = useCallback(() => {}, []);

    const handleSyncFiles = useCallback(async () => {
      setIsSyncing(true);

      try {
        const directoryHandle = await window.showDirectoryPicker();
        toast.success("Files synced successfully");
      } catch (error) {
        console.error("Error syncing files:", error);
        toast.error("Failed to sync files");
      } finally {
        setIsSyncing(false);
      }
    }, []);

    return (
      chatStarted && (
        <motion.div
          initial="closed"
          animate={showWorkbench ? "open" : "closed"}
          variants={workbenchVariants}
          className="z-workbench"
        >
          <div
            className={classNames(
              "fixed top-[calc(var(--header-height)+1.5rem)] bottom-6 w-[var(--workbench-inner-width)] mr-4 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier",
              {
                "w-full": isSmallViewport,
                "left-0": showWorkbench && isSmallViewport,
                "left-[var(--workbench-left)]": showWorkbench,
                "left-[100%]": !showWorkbench,
              }
            )}
          >
            <div className="absolute inset-0 px-2 lg:px-6">
              <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
                <div className="flex items-center px-3 py-2 border-b border-bolt-elements-borderColor">
                  <Slider
                    selected={selectedView}
                    options={sliderOptions}
                    setSelected={setSelectedView}
                  />
                  <div className="ml-auto" />
                  {selectedView && (
                    <div className="flex overflow-y-auto">
                      <PanelHeaderButton
                        className="mr-1 text-sm"
                        onClick={() => {}}
                      >
                        <div className="i-ph:code" />
                        Download Code
                      </PanelHeaderButton>
                      <PanelHeaderButton
                        className="mr-1 text-sm"
                        onClick={handleSyncFiles}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <div className="i-ph:spinner" />
                        ) : (
                          <div className="i-ph:cloud-arrow-down" />
                        )}
                        {isSyncing ? "Syncing..." : "Sync Files"}
                      </PanelHeaderButton>
                      <PanelHeaderButton
                        className="mr-1 text-sm"
                        onClick={() => {}}
                      >
                        <div className="i-ph:terminal" />
                        Toggle Terminal
                      </PanelHeaderButton>
                      <PanelHeaderButton
                        className="mr-1 text-sm"
                        onClick={() => {
                          const repoName = prompt(
                            "Please enter a name for your new GitHub repository:",
                            "bolt-generated-project"
                          );

                          if (!repoName) {
                            alert(
                              "Repository name is required. Push to GitHub cancelled."
                            );
                            return;
                          }

                          const githubUsername = Cookies.get("githubUsername");
                          const githubToken = Cookies.get("githubToken");

                          if (!githubUsername || !githubToken) {
                            const usernameInput = prompt(
                              "Please enter your GitHub username:"
                            );
                            const tokenInput = prompt(
                              "Please enter your GitHub personal access token:"
                            );

                            if (!usernameInput || !tokenInput) {
                              alert(
                                "GitHub username and token are required. Push to GitHub cancelled."
                              );
                              return;
                            }
                          } else {
                          }
                        }}
                      >
                        <div className="i-ph:github-logo" />
                        Push to GitHub
                      </PanelHeaderButton>
                    </div>
                  )}
                  <IconButton
                    icon="i-ph:x-circle"
                    className="-mr-1"
                    size="xl"
                    onClick={() => {}}
                  />
                </div>
                <div className="relative flex-1 overflow-hidden">
                  <View initial={{ x: "-100%" }} animate={{ x: "-100%" }}>
                    <EditorPanel
                      editorDocument={currentDocument}
                      isStreaming={isStreaming}
                      selectedFile={selectedFile}
                      files={files}
                      onFileSelect={onFileSelect}
                      onFileSave={onFileSave}
                      onFileReset={onFileReset}
                    />
                  </View>
                  <View
                    initial={{ x: selectedView === "preview" ? 0 : "100%" }}
                    animate={{ x: selectedView === "preview" ? 0 : "100%" }}
                  >
                    <div className="h-full bg-bolt-elements-background-depth-1" />
                  </View>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )
    );
  }
);
interface ViewProps extends HTMLMotionProps<"div"> {
  children: JSX.Element;
}

const View = memo(({ children, ...props }: ViewProps) => {
  return (
    <motion.div
      className="absolute inset-0"
      transition={viewTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
});
