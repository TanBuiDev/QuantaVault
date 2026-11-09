"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Strips Markdown formatting (bold, italic, backticks, links, headers)
 * before passing text to the Web Speech API utterance.
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links [text](url) -> text
    .replace(/[*_#`~>]/g, "") // remove formatting symbols
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns the best available English voice in the browser.
 * Prioritizes US English (en-US), then generic English (en).
 */
export function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-US" && !v.localService) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en-") && !v.localService) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
}

/**
 * React hook for natural native English speech synthesis via Web Speech API.
 * - Zero external dependencies
 * - Auto-cancels on component unmount
 * - Supports toggling (calling speak on active text cancels it)
 */
export function useEnglishSpeech() {
  const [activeText, setActiveText] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveText(null);
  }, []);

  const speak = useCallback(
    (rawText: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      const clean = cleanTextForSpeech(rawText);
      if (!clean) return;

      // Toggle off if currently speaking the exact same text
      if (activeText === clean && window.speechSynthesis.speaking) {
        stop();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-US";
      utterance.rate = 0.95; // Natural interview pace
      utterance.pitch = 1.0;

      const voice = getEnglishVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => setActiveText(null);
      utterance.onerror = () => setActiveText(null);

      setActiveText(clean);
      window.speechSynthesis.speak(utterance);
    },
    [activeText, stop]
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    speakingText: activeText,
    isSpeaking: (text: string) => activeText !== null && activeText === cleanTextForSpeech(text)
  };
}
