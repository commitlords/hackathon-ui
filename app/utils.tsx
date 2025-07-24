
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST;

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
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const response = await fetch(`${API_BASE_URL}${url}`, modifiedOptions);

    if (response.status === 401) {
        console.log("Access token expired, loging out...");
        removeAuthToken();
        window.location.href = "/";
    }
    return response;
}

