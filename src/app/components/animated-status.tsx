"use client";

import React from "react";
import { motion } from "framer-motion";
import { LoraStatus, statusMessages } from "../constants/Enums";
import { useMessages } from "../hooks/messages";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AnimatedStatusProps {
  statusList?: LoraStatus[];
}

const AnimatedStatus: React.FC<AnimatedStatusProps> = ({ statusList }) => {
  let statuses: LoraStatus[] = [];
  if (statusList) {
    statuses = statusList;
  } else {
    statuses = useMessages().statuses;
  }
  console.log("Statuses:", statuses);

  if (!statuses || statuses.length === 0) {
    return null;
  }

  const currentStatus = statuses[statuses.length - 1];
  const isComplete = currentStatus === LoraStatus.COMPLETED;
  const isFailed = currentStatus === LoraStatus.FAILED;
  const isFinished = isComplete || isFailed;

  // Solid colors for icons and fallbacks
  const successColor = "#2DD4BF";
  const inProgressColor = "#3B82F6";
  const failedColor = "#f43f5e";
  const pastColor = "#94a3b8";

  // Gradient backgrounds for items
  const successGradient =
    "linear-gradient(to right, rgba(59, 130, 246, 0.9), rgba(6, 182, 212, 0.15))";
  const inProgressGradient =
    "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))";
  const failedGradient =
    "linear-gradient(to right, rgba(244, 63, 94, 0.15), rgba(225, 29, 72, 0.15))";
  const pastGradient =
    "linear-gradient(to right, rgba(148, 163, 184, 0.1), rgba(148, 163, 184, 0.05))";

  // Text gradients
  const successTextGradient = "linear-gradient(to right, #3B82F6, #06b6d4)";
  const inProgressTextGradient = "linear-gradient(to right, #3B82F6, #6366f1)";
  const failedTextGradient = "linear-gradient(to right, #f43f5e, #e11d48)";
  const pastTextGradient = "linear-gradient(to right, #94a3b8, #64748b)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-lg p-3 shadow-lg  bg-gray-900/20"
    >
      {/* Status items */}
      <div className="space-y-1">
        {statuses.map((status, index) => {
          const isCurrentStatus = index === statuses.length - 1;
          const isPastStatus = index < statuses.length - 1;

          // Determine gradients for item background and text
          let itemGradient, textGradient, iconColor;

          if (isPastStatus) {
            itemGradient = pastGradient;
            textGradient = pastTextGradient;
            iconColor = pastColor;
          } else if (status === LoraStatus.COMPLETED) {
            itemGradient = successGradient;
            textGradient = successTextGradient;
            iconColor = successColor;
          } else if (status === LoraStatus.FAILED) {
            itemGradient = failedGradient;
            textGradient = failedTextGradient;
            iconColor = failedColor;
          } else {
            itemGradient = inProgressGradient;
            textGradient = inProgressTextGradient;
            iconColor = inProgressColor;
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="flex items-center justify-between p-2 rounded-md"
              style={{
                backgroundImage: isCurrentStatus ? "none" : itemGradient,
                backgroundColor: isCurrentStatus
                  ? "rgba(0, 0, 0, 0.2)"
                  : "transparent",
                borderWidth: isCurrentStatus ? "1px" : "0px",
                borderColor: "rgba(31, 41, 55, 0.5)",
                borderStyle: "solid",
              }}
            >
              {/* Status text with gradient */}
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
                  className="text-sm font-medium"
                  style={{
                    backgroundImage: textGradient,
                    backgroundSize: "100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent", // Modern browsers fallback
                  }}
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
                      style={{ color: iconColor }}
                    />
                  </motion.div>
                ) : status === LoraStatus.FAILED ? (
                  <motion.div
                    initial={{ rotate: 0, scale: 0 }}
                    animate={{ rotate: [0, 5, -5, 0], scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircle className="w-5 h-5" style={{ color: iconColor }} />
                  </motion.div>
                ) : status === LoraStatus.COMPLETED ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: iconColor }}
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
                    <Loader2 className="w-5 h-5" style={{ color: iconColor }} />
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
