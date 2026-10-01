"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SystemSettingsData, getSystemSettings } from "@/lib/api";

interface SettingsContextType {
  settings: SystemSettingsData | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await getSystemSettings();
      if (res && res.success) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.warn("System settings not reachable, fallback to default state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
