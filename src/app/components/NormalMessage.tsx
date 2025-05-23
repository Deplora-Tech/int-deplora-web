"use client";

import { Avatar } from "./ui/avatar";
import AnimatedStatus from "./animated-status";
import MissingInformationForm from "./missing-info";
import { useMessages } from "../hooks/messages";
import { Message } from "../types/MessageTypes";

interface MessageContent {
  missing_information?: any;
  [key: string]: any;
}

interface NormalMessageProps {
  message: Message;
  index: number;
}

export default function NormalMessage({ message, index }: NormalMessageProps) {
  const { messages, loraStatus } = useMessages();

  return (
    <div className="flex-col gap-1" key={message.id}>
      <div key={message.id} className="flex-col gap-3 group pb-3 ">
        <div className="flex items-center gap-2">
          {message.sender === "User" && (
            <Avatar className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.05] shrink-0">
              <img
                src={"/userlogo.svg"}
                alt={"User"}
                className="object-cover"
              />
            </Avatar>
          )}
          <div className="flex-1">
            <div
              className={`rounded-lg px-4 py-3 ${
                message.sender === "Deplora"
                  ? "bg-gray-900/20"
                  : "bg-white/[0.05]"
              }`}
            >
              <div className="text-sm text-gray-400 leading-relaxed font-medium">
                {message.content.missing_information ? (
                  <MissingInformationForm
                    missingInformation={message.content.missing_information}
                    isActive={index === messages.length - 1}
                  />
                ) : typeof message.content === "string" ? (
                  message.content
                ) : (
                  JSON.stringify(message.content)
                )}
              </div>
            </div>
          </div>
        </div>
        {index === messages.length - 1 && loraStatus && (
          <div className="mt-2">
            <AnimatedStatus />
          </div>
        )}
        {message.sender === "Deplora" &&
          message.state &&
          message.state.length > 0 && (
            <div className="">
              <AnimatedStatus statesList={message.state} key={message.id} />
            </div>
          )}
      </div>
    </div>
  );
}
