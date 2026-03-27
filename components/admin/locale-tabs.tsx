"use client";

import { useId, useState } from "react";
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
  const idBase = useId();
  const [activeTab, setActiveTab] = useState(tabs[0]?.code ?? "");

  function getTabIndex(currentCode: string) {
    return tabs.findIndex((tab) => tab.code === currentCode);
  }

  function focusTab(nextIndex: number) {
    const nextTab = tabs[nextIndex];
    if (!nextTab) {
      return;
    }

    setActiveTab(nextTab.code);
    requestAnimationFrame(() => {
      document
        .getElementById(`${idBase}-tab-${nextTab.code}`)
        ?.focus();
    });
  }

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Locale tabs" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.code}
            id={`${idBase}-tab-${tab.code}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.code}
            aria-controls={`${idBase}-panel-${tab.code}`}
            tabIndex={activeTab === tab.code ? 0 : -1}
            onClick={() => setActiveTab(tab.code)}
            onKeyDown={(event) => {
              const currentIndex = getTabIndex(tab.code);
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusTab((currentIndex + 1) % tabs.length);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusTab((currentIndex - 1 + tabs.length) % tabs.length);
              }
              if (event.key === "Home") {
                event.preventDefault();
                focusTab(0);
              }
              if (event.key === "End") {
                event.preventDefault();
                focusTab(tabs.length - 1);
              }
            }}
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
          id={`${idBase}-panel-${tab.code}`}
          role="tabpanel"
          aria-labelledby={`${idBase}-tab-${tab.code}`}
          hidden={activeTab !== tab.code}
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
