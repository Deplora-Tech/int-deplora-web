"use client";

import React from "react";
import { motion } from "framer-motion";
import { LoraStatus, statusMessages } from "../constants/Enums";
import { useMessages } from "../hooks/messages";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const AnimatedStatus: React.FC = () => {
  const { statuses } = useMessages();

  if (!statuses || statuses.length === 0) {
    return null;
  }

  const currentStatus = statuses[statuses.length - 1];
  const isComplete = currentStatus === LoraStatus.COMPLETED;
  const isFailed = currentStatus === LoraStatus.FAILED;
  const isFinished = isComplete || isFailed;

  // Solid colors for better visibility
  const successColor = "#2DD4BF";
  const inProgressColor = "#3B82F6";
  const failedColor = "#f43f5e";
  const pastColor = "#94a3b8"; // Lighter gray for better visibility

  // Gradient backgrounds for items (not text)
  const successGradient =
    "linear-gradient(to right, rgba(59, 130, 246, 0.9), rgba(6, 182, 212, 0.15))";
  const inProgressGradient =
    "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))";
  const failedGradient =
    "linear-gradient(to right, rgba(244, 63, 94, 0.15), rgba(225, 29, 72, 0.15))";
  const pastGradient =
    "linear-gradient(to right, rgba(148, 163, 184, 0.1), rgba(148, 163, 184, 0.05))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-lg p-5 shadow-lg border border-gray-800 bg-gray-900/20"
    >
      {/* Status items */}
      <div className="space-y-1">
        {statuses.map((status, index) => {
          const isCurrentStatus = index === statuses.length - 1;
          const isPastStatus = index < statuses.length - 1;

          // Determine gradient and text color
          let itemGradient, textColor;

          if (isPastStatus) {
            itemGradient = pastGradient;
            textColor = pastColor;
          } else if (status === LoraStatus.COMPLETED) {
            itemGradient = successGradient;
            textColor = successColor;
          } else if (status === LoraStatus.FAILED) {
            itemGradient = failedGradient;
            textColor = failedColor;
          } else {
            itemGradient = inProgressGradient;
            textColor = inProgressColor;
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className={`flex items-center justify-between p-2 rounded-md`}
              style={{
                background: isCurrentStatus
                  ? "rgba(0, 0, 0, 0.2)"
                  : itemGradient,
                borderWidth: isCurrentStatus ? "1px" : "0px",
                borderColor: "rgba(31, 41, 55, 0.5)",
                borderStyle: "solid",
              }}
            >
              {/* Status text */}
              <div className="flex-1 flex items-center">
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{
                    scale: isCurrentStatus ? [1, 1.03, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrentStatus && !isFinished ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                  style={{ color: textColor }}
                  className="text-sm"
                >
                  {statusMessages[status]}
                </motion.span>
              </div>

              {/* Status indicator */}
              <div className="ml-4">
                {isPastStatus ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: successColor }}
                    />
                  </motion.div>
                ) : status === LoraStatus.FAILED ? (
                  <motion.div
                    initial={{ rotate: 0, scale: 0 }}
                    animate={{ rotate: [0, 5, -5, 0], scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircle className="w-5 h-5" style={{ color: textColor }} />
                  </motion.div>
                ) : status === LoraStatus.COMPLETED ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: successColor }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2
                      className="w-5 h-5"
                      style={{ color: successColor }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AnimatedStatus;
