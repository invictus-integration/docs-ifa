import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Sidebar items (processed PropSidebar objects) are plain JSON-serializable data.
// Persisting them in localStorage means the overlay works cross-page without a
// seed navigation on every fresh load.
const STORAGE_KEY = 'invictus-mobile-sidebars';
const CACHE_VERSION = 2;

function readCache() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Bust stale caches from earlier buggy sessions.
    if (parsed._v !== CACHE_VERSION) return {};
    return parsed.data ?? {};
  } catch {
    return {};
  }
}

function writeCache(sidebars) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ _v: CACHE_VERSION, data: sidebars }));
  } catch { }
}

const MobileNavContext = createContext({ sidebars: {}, setSidebarForType: () => {} });

export function MobileNavProvider({ children }) {
  // Initialize empty to match SSR output (avoids hydration mismatch).
  const [sidebars, setSidebars] = useState({});

  // After hydration, restore both sidebars from the cache so the overlay can
  // open immediately without a seed navigation on subsequent page loads.
  useEffect(() => {
    const cached = readCache();
    if (Object.keys(cached).length > 0) {
      setSidebars(cached);
    }
  }, []);

  const setSidebarForType = useCallback((type, data) => {
    setSidebars((prev) => {
      const next = { ...prev, [type]: data };
      writeCache(next);
      return next;
    });
  }, []);

  return (
    <MobileNavContext.Provider value={{ sidebars, setSidebarForType }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export const useMobileNav = () => useContext(MobileNavContext);
