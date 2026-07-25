import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

export const servicesApi = {
  ...createResourceApi("/admin/services"),
  reorder(payload) {
    return adminFetch("/admin/services/reorder", { method: "PATCH", body: payload });
  },
};
