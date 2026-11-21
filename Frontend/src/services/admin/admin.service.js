import adminApi from "./adminApi";

const data = (promise) => promise.then((res) => res.data);

/* ── Auth ───────────────────────────────────────────────────── */
export const login = (username, password) => data(adminApi.post("/api/auth/login", { username, password }));
export const fetchMe = () => data(adminApi.get("/api/auth/me"));
export const changePassword = (currentPassword, newPassword) =>
  data(adminApi.put("/api/auth/password", { currentPassword, newPassword }));

/* ── Dashboard + profile ────────────────────────────────────── */
export const fetchDashboard = () => data(adminApi.get("/api/admin/dashboard"));
export const fetchProfile = () => data(adminApi.get("/api/admin/profile"));
export const saveProfile = (profile) => data(adminApi.put("/api/admin/profile", profile));

/* ── Orderable collections: projects, skills, experience, education, process ── */
export const listItems = (resource) => data(adminApi.get(`/api/admin/${resource}`));
export const createItem = (resource, item) => data(adminApi.post(`/api/admin/${resource}`, item));
export const updateItem = (resource, id, changes) => data(adminApi.put(`/api/admin/${resource}/${id}`, changes));
export const deleteItem = (resource, id) => adminApi.delete(`/api/admin/${resource}/${id}`);
export const reorderItems = (resource, ids) => data(adminApi.patch(`/api/admin/${resource}/reorder`, { ids }));

/* ── Messages ───────────────────────────────────────────────── */
/** Fired after a message changes so the sidebar's unread badge can refresh. */
export const MESSAGES_CHANGED_EVENT = "admin:messages-changed";
const notifyMessagesChanged = (result) => {
  window.dispatchEvent(new Event(MESSAGES_CHANGED_EVENT));
  return result;
};

export const listMessages = (status = "all") => data(adminApi.get("/api/admin/messages", { params: { status } }));
export const markMessage = (id, read) =>
  data(adminApi.patch(`/api/admin/messages/${id}`, { read })).then(notifyMessagesChanged);
export const deleteMessage = (id) => adminApi.delete(`/api/admin/messages/${id}`).then(notifyMessagesChanged);

/* ── Uploads ────────────────────────────────────────────────── */
/** Upload an image or PDF; resolves to { url }. */
export function uploadFile(file, kind = "image", onProgress) {
  const form = new FormData();
  form.append("file", file);
  return data(
    adminApi.post("/api/admin/uploads", form, {
      params: { kind },
      onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
    }),
  );
}
