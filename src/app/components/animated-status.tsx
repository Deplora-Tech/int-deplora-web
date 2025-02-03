"use client";
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { LoraStatus, statusMessages } from "../constants/Enums";

interface AnimatedStatusProps {
  statuses: LoraStatus[];
}

interface StatusItemProps {
  message: string;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}

function StatusItem({
  message,
  isActive,
  isCompleted,
  isFailed,
}: StatusItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
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
        ) : null}
      </div>
      <span className="text-sm">{message}</span>
    </motion.div>
  );
}

export default function AnimatedStatus({ statuses }: AnimatedStatusProps) {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-2">
        <AnimatePresence>
          {statuses.map((status, index) => (
            <StatusItem
              key={index}
              message={statusMessages[status]}
              isActive={index === statuses.length - 1 && status !== LoraStatus.FAILED && status !== LoraStatus.COMPLETED}
              isCompleted={index < statuses.length - 1 || status === LoraStatus.COMPLETED}
              isFailed={status === LoraStatus.FAILED}
            />
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
