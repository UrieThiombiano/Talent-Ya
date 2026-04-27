const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("ty_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("ty_token", token);
  else localStorage.removeItem("ty_token");
}

async function request(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...opts.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  let data;
  try { data = await res.json(); } catch { data = null; }

  if (!res.ok) {
    const err = new Error(data?.error || `Erreur ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  signup: (creds) => request("/api/auth/signup", { method: "POST", body: creds }),
  login: (creds) => request("/api/auth/login", { method: "POST", body: creds }),
  me: () => request("/api/auth/me"),

  // analyse
  runAnalysis: (data) => request("/api/analysis/run", { method: "POST", body: data }),

  // simulation
  startSim: (data) => request("/api/simulation/start", { method: "POST", body: data }),
  simMessage: (data) => request("/api/simulation/message", { method: "POST", body: data }),
  finalizeSim: (data) => request("/api/simulation/finalize", { method: "POST", body: data }),

  // progression
  getProgress: () => request("/api/progress"),
  completeModule: (moduleId) => request("/api/progress/module/complete", {
    method: "POST", body: { moduleId },
  }),
};
