"use client";

import { LampContainer } from "../ui/lamp";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface LandingProps {
  onStartChat: () => void;
}

export function Landing({ onStartChat }: LandingProps) {
  return (
    <div className="flex flex-1 relative items-center justify-center">
      <LampContainer className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="px-4 py-32 md:py-64 flex flex-col items-center justify-center"
        >
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              Infrastructure as Code with AI
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/60">
              Deplora is an AI-powered platform for creating robust
              infrastructure as code deployments for your cloud applications.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button
                onClick={onStartChat}
                size="lg"
                className="group relative overflow-hidden rounded-lg bg-blue-500 px-8 py-6 text-lg font-bold text-white transition-all duration-300 hover:bg-blue-400"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 h-full w-full translate-y-[100%] bg-gradient-to-br from-blue-400 to-teal-300 opacity-80 transition-transform duration-300 group-hover:translate-y-[0%]"></div>
                <span className="relative z-10">Start Building</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </LampContainer>
    </div>
  );
}
