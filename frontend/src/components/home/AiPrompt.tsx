"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { examplePrompts, modelOptions } from "@/lib/constants";

export function AiPrompt() {
  const [prompt, setPrompt] = useState(examplePrompts[0]);
  const [model, setModel] = useState(modelOptions[0]);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPrompt = async () => {
    setIsSubmitting(true);
    setSubmitted(null);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setSubmitted(`Queued in ${model} with project synthesis, memory priming, and agent staffing.`);
    setIsSubmitting(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel floating-panel neural-border overflow-hidden p-6"
    >
      <div className="absolute inset-0 bg-primary/5 blur-3xl" aria-hidden />
      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="primary">AI launchpad</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Describe your project and let AiO assemble the enterprise operating surface.</h1>
            <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
              Prompt once to provision workspace panels, memory context, knowledge retrieval, and agent staffing with adaptive controls.
            </p>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" className="gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                {model}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={8} className="glass-panel min-w-56 p-2 shadow-glass">
              {modelOptions.map((option) => (
                <DropdownMenu.Item
                  key={option}
                  onSelect={() => setModel(option)}
                  className="rounded-lg px-3 py-2 text-sm outline-none transition hover:bg-foreground/5"
                >
                  {option}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Describe your project..."
          className="min-h-[180px] w-full rounded-3xl border border-primary/25 bg-card/70 p-5 font-medium text-foreground outline-none ring-0 transition placeholder:text-foreground/30 focus:border-primary/60 neural-glow"
        />

        <div className="flex flex-wrap gap-2">
          {examplePrompts.slice(0, 4).map((item) => (
            <button
              key={item}
              className="rounded-full border border-border/80 bg-card/60 px-3 py-2 text-left text-xs text-foreground/65 transition hover:border-primary/40 hover:text-foreground"
              onClick={() => setPrompt(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" className="gap-2 rounded-2xl" onClick={submitPrompt} disabled={isSubmitting}>
            <Sparkles className="h-4 w-4" />
            {isSubmitting ? "Synthesizing workspace..." : "Launch workspace"}
          </Button>
          <p className="text-sm text-foreground/55">Includes context hydration, agent staffing, and adaptive panels.</p>
        </div>

        <AnimatePresence>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
            >
              {submitted}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
