// src/api/fetchClient.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

console.log("[fetchClient] API_BASE =", API_BASE);

// in-memory token
let accessToken = null;
export function setAccessToken(token) {
  accessToken = token || null;
  console.log("[fetchClient] setAccessToken =", accessToken);
}
export function clearAccessToken() {
  accessToken = null;
  console.log("[fetchClient] clearAccessToken()");
}

export async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  console.log("\n========== FETCH REQUEST ==========");
  console.log("[fetch] URL:", url);
  console.log("[fetch] Method:", opts.method || "GET");
  console.log("[fetch] Body:", opts.body);
  console.log("[fetch] Initial Options:", opts);

  const headers = new Headers(opts.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
    console.log("[fetch] Attached Authorization header");
  }

  if (!headers.get("Content-Type") && opts.body && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    console.log("[fetch] Added Content-Type: application/json");
  }

  const finalOpts = {
    ...opts,
    headers,
    credentials: "include",
  };

  console.log("[fetch] Final Options:", finalOpts);

  let res;
  try {
    res = await fetch(url, finalOpts);
    console.log("[fetch] Response Status:", res.status);
  } catch (err) {
    console.error("🚨 [fetch] NETWORK ERROR (Request never reached server)");
    console.error(err);
    err.isNetworkError = true;
    throw err;
  }

  // If 401, try refresh logic
  if (res.status === 401 && !opts._retry) {
    console.warn("[fetch] 401 detected → trying refresh()");
    const refreshed = await tryRefresh();
    if (refreshed) {
      console.warn("[fetch] Refresh succeeded → retrying original request");
      return request(path, { ...opts, _retry: true });
    }
    console.warn("[fetch] Refresh failed");
  }

  console.log("[fetch] FINAL RESPONSE STATUS:", res.status);
  return res;
}

async function tryRefresh() {
  const url = `${API_BASE}/auth/refresh`;

  console.log("\n========== TRY REFRESH ==========");
  console.log("[refresh] URL:", url);

  try {
    const res = await fetch(url, { method: "POST", credentials: "include" });
    console.log("[refresh] Status:", res.status);

    if (!res.ok) return false;

    const data = await res.json();
    console.log("[refresh] Response Body:", data);

    if (!data?.accessToken) return false;

    console.log("[refresh] New Access Token =", data.accessToken);
    setAccessToken(data.accessToken);

    try { localStorage.setItem("access_token", data.accessToken); } catch (_) {}

    return true;
  } catch (err) {
    console.error("[refresh] NETWORK ERROR:", err);
    return false;
  }
}
