"use client"

import { create } from 'zustand'

type ChatState = {
  isStarted: boolean
  setIsStarted: (started: boolean) => void
}

export const useChatState = create<ChatState>((set: any) => ({
  isStarted: false,
  setIsStarted: (started: any) => set({ isStarted: started }),
}))

