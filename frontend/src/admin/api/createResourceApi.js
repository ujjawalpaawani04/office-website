import { adminFetch } from "./adminClient";

// One factory instead of hand-writing list/get/create/update/remove for
// each of the ~10 simple admin resources - mirrors the backend's generic
// CRUD factory (app/utils/admin_crud.py) so the two stay in lockstep.
export function createResourceApi(basePath) {
  return {
    list(params = {}) {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
      ).toString();
      return adminFetch(`${basePath}${query ? `?${query}` : ""}`);
    },
    get(id) {
      return adminFetch(`${basePath}/${id}`);
    },
    create(payload) {
      return adminFetch(basePath, { method: "POST", body: payload });
    },
    update(id, payload) {
      return adminFetch(`${basePath}/${id}`, { method: "PUT", body: payload });
    },
    remove(id) {
      return adminFetch(`${basePath}/${id}`, { method: "DELETE" });
    },
  };
}
