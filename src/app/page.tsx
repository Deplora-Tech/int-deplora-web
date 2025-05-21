"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Landing, LandingChat } from "./components/landing";
import { useMessages } from "./hooks/messages";
import { useSession } from "./hooks/session";
import { LoraStatus } from "./constants/Enums";

export default function Home() {
  const { loraStatus, fileContent } = useMessages();
  const { session_id , setClientId} = useSession();
  const [hasFiles, setHasFiles] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClientId("user1")
  }
  , []);

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

  // Move navigation logic into useEffect
  useEffect(() => {
    if (hasFiles && session_id) {
      router.push(`chat/${session_id}`);
      router.refresh();
    }
  }, [hasFiles, session_id, router]);

  console.log("loraStatus", loraStatus);
  console.log("hasFiles", hasFiles);
  console.log("isChatOpen", isChatOpen);

  if (isChatOpen && !hasFiles) {
    return <LandingChat />;
  }

  if (!hasFiles) {
    return <Landing />;
  }

  return null;
}
