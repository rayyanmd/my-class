"use client";

import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        Boolean(
          (window.navigator as Navigator & { standalone?: boolean }).standalone,
        ));

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!installEvent) {
    return null;
  }

  const handleInstall = async () => {
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;

    if (outcome === "accepted" || outcome === "dismissed") {
      setInstallEvent(null);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="mt-3"
      onClick={handleInstall}
    >
      <DownloadIcon />
      Install app
    </Button>
  );
}
