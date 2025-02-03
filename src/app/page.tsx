"use client";

import { useEffect, useState } from "react";

import { Landing, LandingChat } from "./components/landing";
import { useRouter } from 'next/navigation'

import {  useMessages } from "./hooks/messages";
import { LoraStatus, statusMessages } from "./constants/Enums";
import { redirect } from 'next/navigation'

export default function Home() {
  const { loraStatus, fileContent, session_id } = useMessages();
  const [hasFiles, setHasFiles] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (loraStatus === LoraStatus.STARTING) {
      setIsChatOpen(true);
    }
  }, [loraStatus]);

  useEffect(() => {
    if (Object.keys(fileContent).length > 0) {
      setHasFiles(true);
    }
  }, [fileContent]);

  if (isChatOpen && !hasFiles) {
    return <LandingChat />;
  }

  if (!hasFiles) {
    return <Landing />;
  }

  // navigate to /chat/session_id

  redirect(`chat/${session_id}`);
}
