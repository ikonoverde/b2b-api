type GoogleAnalyticsParameters = Record<string, string | number | boolean | null | undefined>;

declare global {
    interface Window {
        googleAnalyticsMeasurementId?: string;
        gtag?: (command: string, target: string, parameters?: GoogleAnalyticsParameters) => void;
    }
}

export function trackGoogleAnalyticsPageView(url: string): void {
    if (!window.googleAnalyticsMeasurementId || typeof window.gtag !== 'function') {
        return;
    }

    const pageUrl = new URL(url, window.location.origin);

    window.gtag('event', 'page_view', {
        page_location: pageUrl.href,
        page_path: `${pageUrl.pathname}${pageUrl.search}`,
        page_title: document.title,
        send_to: window.googleAnalyticsMeasurementId,
    });
}
