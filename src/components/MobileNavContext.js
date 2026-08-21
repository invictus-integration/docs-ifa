import React, { createContext, useContext, useState } from 'react';

// Bridge that carries the CURRENT page's real, live sidebar out to the
// Navbar-level mobile audience overlay (which renders outside the doc page's
// DocsSidebarProvider tree, so it can't call useDocsSidebar() itself).
//
// This only ever holds a snapshot of whatever page is genuinely being
// rendered right now — never a persisted cache of a *different* section kept
// around for an instant "preview" swap. That earlier design (cross-section
// caching, persisted to localStorage) caused a real bug: switching sections
// without navigating could show a stale sidebar left over from before a
// content change, only fixed by a hard refresh. Keeping this in-memory only,
// and always overwritten by the real current page, means there is nothing
// that can go stale — switching sections now always triggers a real
// navigation (see UserTypeSwitcher / Navbar/Layout), which is what refreshes
// this value.
const MobileNavContext = createContext({ sidebar: null, setSidebar: () => {} });

export function MobileNavProvider({ children }) {
  const [sidebar, setSidebar] = useState(null);

  return (
    <MobileNavContext.Provider value={{ sidebar, setSidebar }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export const useMobileNav = () => useContext(MobileNavContext);
