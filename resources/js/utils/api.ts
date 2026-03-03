function getCsrfToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
        try {
            return decodeURIComponent(match[2]);
        } catch {
            return match[2];
        }
    }
    return null;
}

export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return fetch(url, {
        credentials: 'include',
        ...options,
        headers,
    });
}
