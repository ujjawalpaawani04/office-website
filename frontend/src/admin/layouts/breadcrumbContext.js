import { createContext } from "react";

// Lets any page deep in the route tree set the breadcrumb shown in the
// Topbar, without prop-drilling through every layout in between.
export const BreadcrumbContext = createContext({ setItems: () => {} });
