"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Rocket, ShieldCheck, Zap } from "lucide-react";
import { quickActions } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const icons = [Plus, Rocket, Zap, ShieldCheck];

export function QuickActions() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Quick actions</p>
          <h2 className="mt-2 text-xl font-semibold">One-click enterprise automations</h2>
        </div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="secondary">New project</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <Dialog.Content className="glass-panel fixed left-1/2 top-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 p-6 shadow-glass">
              <Dialog.Title className="text-xl font-semibold">Provision a new enterprise workspace</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-foreground/60">
                Spin up a project room with memory, knowledge connectors, quality gates, and a recommended agent swarm.
              </Dialog.Description>
              <div className="mt-5 space-y-3 rounded-2xl border border-border/80 bg-card/50 p-4 text-sm text-foreground/70">
                <p>• Adaptive layout scaffolded for desktop, tablet, and mobile.</p>
                <p>• Memory and knowledge baselines attached to your domain templates.</p>
                <p>• AI launch brief generated with executive, delivery, and compliance lanes.</p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button>Provision workspace</Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div className="grid gap-3">
        {quickActions.map((action, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.button
              whileHover={{ x: 4 }}
              key={action.title}
              className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/45 p-4 text-left transition hover:border-primary/35 hover:bg-card/70"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="mt-1 text-sm text-foreground/55">{action.detail}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground/45" />
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}
