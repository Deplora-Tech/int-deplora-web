"use client";

import { useState, useEffect } from "react";
import { v4 } from "uuid";
import { useSession } from "./session";

export function useLandingState() {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [showPopup, setShowPopup] = useState(false);


  const { setSessionId, session_id } = useSession();


  // Initialize session if needed
  useEffect(() => {
    if (!session_id) {
      const id = v4();
      setSessionId(id);
      console.log("Setting session id:", id);
    }
  }, [session_id, setSessionId]);

  // Scroll handlers
  const handleScrollToBottom = () => {
    if (containerElement) {
      containerElement.scrollTo({
        top: containerElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
    }
  };

  return {
    input,
    setInput,
    showScrollButton,
    setShowScrollButton,
    containerElement,
    setContainerElement,
    showPopup,
    setShowPopup,
    session_id,

    handleScrollToBottom,
    handleScroll,
  };
}
