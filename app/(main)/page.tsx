
"use client";

import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import LoadingDots from "../../components/loading-dots";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

export default function Home() {
  let [status, setStatus] = useState<"initial" | "creating" | "created" | "updating" | "updated">("initial");
  let [prompt, setPrompt] = useState("");
  let models = [
    { label: "gemini-2.0-flash-exp", value: "gemini-2.0-flash-exp" },
    { label: "gemini-1.5-pro", value: "gemini-1.5-pro" },
    { label: "gemini-1.5-flash", value: "gemini-1.5-flash" }
  ];
  let [model, setModel] = useState(models[0].value);
  let [shadcn, setShadcn] = useState(false);
  let [generatedCode, setGeneratedCode] = useState("");
  let [initialAppConfig, setInitialAppConfig] = useState({ model: "", shadcn: true });
  let [ref, scrollTo] = useScrollTo();
  let [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  let loading = status === "creating" || status === "updating";

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "initial") scrollTo({ delay: 0.5 });
    
    setStatus("creating");
    setGeneratedCode("");

    try {
      let res = await fetch("/api/generateCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          shadcn,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(res.statusText);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let receivedData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedData += new TextDecoder().decode(value);
        const cleanedData = removeCodeFormatting(receivedData);
        setGeneratedCode(cleanedData);
      }

      setMessages([{ role: "user", content: prompt }]);
      setInitialAppConfig({ model, shadcn });
      setStatus("created");
    } catch (error) {
      console.error("Error generating code:", error);
      setStatus("initial");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Advanced <span className="text-blue-400">AI-Powered</span> Code Generation
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Generate production-ready code with advanced features including automatic continuation,
            error detection, and smart refactoring.
          </p>
        </div>

        <form onSubmit={createApp} className="mt-16">
          <div className="space-y-8">
            <div className="relative">
              <textarea
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block w-full rounded-xl bg-gray-800 px-6 py-4 text-lg text-white placeholder-gray-400 shadow-sm ring-1 ring-gray-700 focus:ring-blue-500"
                placeholder="Describe your application..."
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute bottom-4 right-4 rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? <LoadingDots /> : "Generate"}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Model:</span>
                <Select.Root value={model} onValueChange={setModel}>
                  <Select.Trigger className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-lg bg-gray-800 shadow-xl">
                      <Select.Viewport className="p-2">
                        {models.map((m) => (
                          <Select.Item
                            key={m.value}
                            value={m.value}
                            className="flex cursor-pointer items-center rounded px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          >
                            <Select.ItemText>{m.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">shadcn/ui:</span>
                <Switch.Root
                  checked={shadcn}
                  onCheckedChange={setShadcn}
                  className="relative h-6 w-11 rounded-full bg-gray-700 transition-colors data-[state=checked]:bg-blue-500"
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>
            </div>
          </div>
        </form>

        {status !== "initial" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
            ref={ref}
          >
            <div className="rounded-xl bg-gray-800 p-6">
              <CodeViewer code={generatedCode} showEditor />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
