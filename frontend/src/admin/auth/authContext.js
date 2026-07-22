import { createContext } from "react";

// Split into its own file (no components here) so Vite's react-refresh
// plugin can still fast-refresh AuthProvider.jsx / useAuth.js separately -
// a file that exports both a context/value and a component breaks that.
export const AuthContext = createContext(null);
