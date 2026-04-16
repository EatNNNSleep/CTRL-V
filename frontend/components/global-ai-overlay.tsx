"use client";

import { AIOverlay } from "./ai-overlay";
import { useUI } from "./map-dashboard/ui-context";

export function GlobalAIOverlay() {
  const { isAIOverlayOpen, setIsAIOverlayOpen, aiOverlayTab } = useUI();

  return (
    <AIOverlay
      isOpen={isAIOverlayOpen}
      onClose={() => setIsAIOverlayOpen(false)}
      initialTab={aiOverlayTab}
    />
  );
}
