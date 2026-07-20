"use client";

import { useState } from "react";
import { ArrowUp, Bot, User2 } from "lucide-react";
import { workspaceMessages } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function WorkspaceChat() {
  const [messages, setMessages] = useState(workspaceMessages);
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: current.length + 1, role: "user", author: "You", body: value, time: "Now" },
      {
        id: current.length + 2,
        role: "assistant",
        author: "Orchestrator Agent",
        body: "I logged that request, attached it to the active task graph, and proposed the next operator actions.",
        time: "Now",
      },
    ]);
    setValue("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role !== "user" && (
              <div className="mt-1 rounded-xl bg-primary/15 p-2 text-primary">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-3xl rounded-3xl border px-4 py-3 ${message.role === "user" ? "border-primary/30 bg-primary/10" : "border-border/80 bg-card/50"}`}>
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground/45">
                {message.role === "user" ? <User2 className="h-3.5 w-3.5" /> : null}
                <span>{message.author}</span>
                <span>{message.time}</span>
              </div>
              <p className="text-sm text-foreground/75">{message.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-3 rounded-3xl border border-border/80 bg-card/55 p-3">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask the workspace to plan, search, summarize, or ship."
          className="min-h-[96px] flex-1 resize-none bg-transparent p-2 text-sm text-foreground outline-none placeholder:text-foreground/35"
        />
        <Button size="icon" className="rounded-2xl" onClick={send}>
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
