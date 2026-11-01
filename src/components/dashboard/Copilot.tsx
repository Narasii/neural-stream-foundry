import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, Globe, Mic, MoreVertical, Plus, Waves } from "lucide-react";
import { copilotReply } from "./data";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "bot";
  text: string;
}

export function Copilot({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "user", text: "Why is batch latency up on Stream Bench?" },
    { role: "bot", text: copilotReply("latency") },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: copilotReply(q) }]);
    setInput("");
  };

  return (
    <aside className="flex h-[560px] w-[320px] flex-col rounded-2xl bg-popover shadow-2xl ring-1 ring-border">
      <header className="flex items-center justify-between border-b border-border px-3 py-3">
        <button onClick={onClose} aria-label="Close assistant" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
        </button>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Waves className="size-4 text-primary" /> Stream Copilot
        </span>
        <MoreVertical className="size-4 text-muted-foreground" />
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-[13px] leading-relaxed">
        {msgs.map((m, i) => (
          <p
            key={i}
            className={cn(
              "whitespace-pre-line",
              m.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-primary-foreground"
                : "text-popover-foreground",
            )}
          >
            {m.text}
          </p>
        ))}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="m-3 rounded-xl bg-column p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about bandwidth, memory, latency…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-3 flex items-center gap-3 text-muted-foreground">
          <Plus className="size-4" />
          <Globe className="size-4" />
          <Mic className="size-4" />
          <button
            type="submit"
            aria-label="Send"
            className="ml-auto grid size-7 place-items-center rounded-full bg-foreground text-background hover:opacity-90"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
