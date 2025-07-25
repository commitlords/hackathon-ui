export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_HOST || ""
).replace(/\/$/, "");

export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function removeAuthToken(): void {
  localStorage.removeItem("authToken");
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const accessToken = getAuthToken();

  const modifiedOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  };

  console.log("fetchWithAuth: headers =", modifiedOptions.headers);

  // Sanitize URL to prevent double slashes
  const fullUrl = `${API_BASE_URL}/${url.replace(/^\//, "")}`;
  const response = await fetch(fullUrl, modifiedOptions);

  if (response.status === 401) {
    console.log("Access token expired, loging out...");
    removeAuthToken();
    window.location.href = "/";
  }
  return response;
};
