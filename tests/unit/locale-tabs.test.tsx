import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { LocaleTabs } from "@/components/admin/locale-tabs";

describe("LocaleTabs", () => {
  test("exposes accessible tab semantics and keyboard navigation", async () => {
    vi.stubGlobal(
      "requestAnimationFrame",
      ((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      }) as typeof requestAnimationFrame,
    );

    render(
      <LocaleTabs
        tabs={[
          {
            code: "en",
            label: "English",
            description: "English content",
            content: <div>English panel</div>,
          },
          {
            code: "fr",
            label: "French",
            description: "French content",
            content: <div>French panel</div>,
          },
        ]}
      />,
    );

    const englishTab = screen.getByRole("tab", { name: "English" });
    const frenchTab = screen.getByRole("tab", { name: "French" });

    expect(englishTab).toHaveAttribute("aria-selected", "true");
    expect(frenchTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel", { name: "English" })).toBeVisible();

    fireEvent.keyDown(englishTab, { key: "ArrowRight" });

    await waitFor(() => {
      expect(frenchTab).toHaveAttribute("aria-selected", "true");
    });
    expect(screen.getByRole("tabpanel", { name: "French" })).toBeVisible();
    expect(frenchTab).toHaveFocus();
  });
});
