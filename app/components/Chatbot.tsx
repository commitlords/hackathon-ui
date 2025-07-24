"use client";

import { useState, useRef } from "react";
import { Button, Card, TextInput, Spinner } from "flowbite-react";
import { HiMicrophone, HiPaperAirplane } from "react-icons/hi2";
import { HiX } from "react-icons/hi";
import Image from "next/image";

// TypeScript declarations for browser speech APIs

const SpeechRecognition =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof window !== "undefined" &&
  ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition);
const synth = typeof window !== "undefined" && window.speechSynthesis;

export default function Chatbot() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Start voice recognition
  const startListening = () => {
    if (!SpeechRecognition)
      return alert("Speech recognition not supported in this browser.");
    setListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).stop();
      setListening(false);
    }
  };

  // Send message to API
  const sendMessage = async (msg?: string) => {
    const userMsg = msg || input.trim();
    if (!userMsg) return;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/chatbot/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.response || "No response." },
      ]);
      // Optionally speak the response
      if (synth && data.response) {
        const utter = new SpeechSynthesisUtterance(data.response);
        utter.lang = "en-IN";
        synth.speak(utter);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg transition-transform hover:scale-105 sm:h-14 sm:w-14 dark:bg-gray-700"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
          title="Chat with LOKSamarth"
        >
          <Image
            src="/Logo.png"
            alt="Chatbot"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full sm:h-8 sm:w-8"
          />
        </button>
      )}
      {/* Chatbot Window */}
      {open && (
        <div className="fixed right-4 bottom-4 z-50 flex w-full max-w-xs justify-end sm:max-w-sm">
          <div className="w-full max-w-xs sm:max-w-sm">
            <Card className="rounded-2xl border-2 bg-white/90 shadow-2xl dark:bg-gray-900/90">
              <div className="mb-2 flex items-center gap-2 px-2 pt-2">
                <Image
                  src="/Logo.png"
                  alt="LOKSamarth Logo"
                  width={16}
                  height={16}
                  className="h-4 w-4 rounded-full sm:h-6 sm:w-6"
                />
                <span className="text-base font-bold text-gray-900 dark:text-gray-200">
                  Ask LOKSamarth
                </span>
                <button
                  className="ml-auto rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setOpen(false)}
                  aria-label="Close chatbot"
                >
                  <HiX className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                </button>
              </div>
              <div className="mb-2 flex h-48 flex-col gap-2 overflow-y-auto rounded-lg bg-gray-50 p-2 sm:h-56 dark:bg-gray-800">
                {messages.length === 0 && (
                  <div className="my-auto text-center text-gray-400">
                    How can I help you today?
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-gray-200 px-3 py-1.5 text-black dark:bg-gray-700 dark:text-gray-100">
                      <Spinner size="sm" /> <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-2 pb-2">
                <Button
                  color={listening ? "red" : "dark"}
                  onClick={listening ? stopListening : startListening}
                  size="sm"
                  pill
                  aria-label={listening ? "Stop listening" : "Start listening"}
                  className="flex-shrink-0"
                >
                  <HiMicrophone className={listening ? "animate-pulse" : ""} />
                </Button>
                <TextInput
                  className="flex-1"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoFocus
                />
                <Button
                  color="none"
                  onClick={() => sendMessage()}
                  size="sm"
                  pill
                  aria-label="Send message"
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 border-none bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
                >
                  <HiPaperAirplane />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
