"use client";

import { useEffect, useState } from "react";

import { Landing, LandingChat } from "./components/landing";
import { useRouter } from "next/navigation";

import { useMessages } from "./hooks/messages";
import { useSession } from "./hooks/session";
import { LoraStatus, statusMessages } from "./constants/Enums";

export default function Home() {
  const { loraStatus, fileContent } = useMessages();
  const { session_id } = useSession();
  const [hasFiles, setHasFiles] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loraStatus === LoraStatus.STARTING) {
      setIsChatOpen(true);
    }
  }, [loraStatus]);

  useEffect(() => {
    if (fileContent && Object.keys(fileContent).length > 0) {
      setHasFiles(true);
    }
  }, [fileContent]);
  console.log("loraStatus", loraStatus);
  console.log("hasFiles", hasFiles);
  console.log("isChatOpen", isChatOpen);

  if (isChatOpen && !hasFiles) {
    return <LandingChat />;
  }

  if (!hasFiles) {
    return <Landing />;
  }

  // navigate to /chat/session_id
  if (hasFiles && session_id) {
    router.push(`chat/${session_id}`);
    router.refresh();
  }
}
