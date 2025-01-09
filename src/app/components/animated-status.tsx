"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { LoraStatus, useMessages } from "../hooks/messages";

export const statusMessages: Record<LoraStatus, string> = {
  [LoraStatus.STARTING]: "Starting the process...",
  [LoraStatus.INTENT_DETECTED]: "Intent detected! Analyzing further...",
  [LoraStatus.RETRIEVING_USER_PREFERENCES]: "Retrieving user preferences...",
  [LoraStatus.RETRIEVING_PROJECT_DETAILS]: "Fetching project details...",
  [LoraStatus.GENERATING_DEPLOYMENT_PLAN]: "Generating the deployment plan...",
  [LoraStatus.GENERATED_DEPLOYMENT_PLAN]:
    "Deployment plan generated successfully!",
  [LoraStatus.GATHERING_DATA]: "Gathering additional data...",
  [LoraStatus.COMPLETED]: "Process completed successfully!",
  [LoraStatus.FAILED]: "Something went wrong. Please try again.",
};

interface StatusItemProps {
  message: string;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  shouldShow: boolean;
}

function StatusItem({
  message,
  isActive,
  isCompleted,
  isFailed,
  shouldShow,
}: StatusItemProps) {
  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-white/70${
        isActive ? "bg-primary/10" : ""
      }`}
    >
      <div className="flex-shrink-0">
        {isFailed ? (
          <XCircle className="h-5 w-5 text-red-500" />
        ) : isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-400/60" />
        ) : isActive ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-5 w-5 text-primary" />
          </motion.div>
        ) : (
          ""
        )}
      </div>
      <span className={`text-sm ${"text-muted-foreground"}`}>{message}</span>
    </motion.div>
  );
}

export default function AnimatedStatus({ isActive }: { isActive: boolean }) {
  const { loraStatus } = useMessages();
  const [currentStatus, setCurrentStatus] = useState<LoraStatus>(
    LoraStatus.STARTING
  );
  const [visibleSteps, setVisibleSteps] = useState<number>(1);
  const statusOrder = Object.values(LoraStatus);

  useEffect(() => {
    if (!loraStatus) return;

    setCurrentStatus(loraStatus);

    const stepIndex = statusOrder.indexOf(loraStatus);
    if (stepIndex >= 0) {
      setVisibleSteps(stepIndex + 1);
    }

    // Stop circular loader on completion or failure
    if (
      loraStatus === LoraStatus.COMPLETED ||
      loraStatus === LoraStatus.FAILED
    ) {
      setVisibleSteps(statusOrder.length); // Show all steps
    }
  }, [loraStatus, statusOrder]);

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-2">
        <div className="mt-2">
          <AnimatePresence mode="wait">
            {Object.entries(statusMessages).map(([status, message], index) => (
              <StatusItem
                key={status}
                message={message}
                isActive={
                  currentStatus === status &&
                  currentStatus !== LoraStatus.COMPLETED &&
                  currentStatus !== LoraStatus.FAILED
                } // Stop loader when completed or failed
                isCompleted={
                  statusOrder.indexOf(status as LoraStatus) <
                  statusOrder.indexOf(currentStatus)
                }
                isFailed={
                  currentStatus === LoraStatus.FAILED &&
                  status === LoraStatus.FAILED
                }
                shouldShow={index < visibleSteps}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
