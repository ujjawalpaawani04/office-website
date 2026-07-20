import { useState } from "react";
import { MobileNavContext } from "./MobileNavContext";

export const MobileNavProvider = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <MobileNavContext.Provider value={{ isMobileNavOpen, setIsMobileNavOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
};
