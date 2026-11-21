const KEY = "portfolio.admin.token";

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/** Seconds-since-epoch expiry from the JWT payload (no signature check — the API does that). */
function expiryOf(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp ?? 0;
  } catch {
    return 0;
  }
}

/** The stored token, or null if missing or expired. */
export function getToken() {
  const token = read();
  if (!token) return null;
  if (expiryOf(token) * 1000 <= Date.now()) {
    clearToken();
    return null;
  }
  return token;
}

export function setToken(token) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* private mode: session lasts until reload */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
