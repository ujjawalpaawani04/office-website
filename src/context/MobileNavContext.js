import { createContext, useContext } from "react";

// Shared open/close state for the mobile nav drawer so sibling layout pieces
// (floating WhatsApp button, floating social bar) can react to it without
// prop-drilling through Header -> MobileNav. Provider lives in
// MobileNavProvider.jsx so this file only exports non-component bindings.
export const MobileNavContext = createContext(undefined);

export const useMobileNav = () => {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }
  return context;
};
