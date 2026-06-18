function getCsrfToken() {
  const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
  if (match) {
    try {
      return decodeURIComponent(match[2]);
    } catch {
      return match[2];
    }
  }
  return null;
}
function apiFetch(url, options = {}) {
  const csrfToken = getCsrfToken();
  const headers = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
    ...options.headers || {}
  };
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = csrfToken;
  }
  return fetch(url, {
    credentials: "include",
    ...options,
    headers
  });
}
export {
  apiFetch as a
};
