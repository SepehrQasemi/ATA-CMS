"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LocaleTab = {
  code: string;
  content: ReactNode;
  description?: string;
  label: string;
};

type LocaleTabsProps = {
  tabs: LocaleTab[];
};

export function LocaleTabs({ tabs }: LocaleTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.code ?? "");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.code}
            type="button"
            onClick={() => setActiveTab(tab.code)}
            className={cn(
              "focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.code
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-foreground hover:bg-[#fff0f0]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.code}
          className={cn("space-y-4", activeTab === tab.code ? "block" : "hidden")}
        >
          {tab.description ? (
            <p className="text-sm leading-6 text-muted">{tab.description}</p>
          ) : null}
          {tab.content}
        </div>
      ))}
    </div>
  );
}
