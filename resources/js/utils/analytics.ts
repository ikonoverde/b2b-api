type GoogleAnalyticsParameters = Record<string, string | number | boolean | null | undefined>;

type MetaPixelContent = {
    id: string;
    quantity: number;
    item_price?: number;
};

type MetaPixelParameters = {
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    contents?: MetaPixelContent[];
    currency?: string;
    num_items?: number;
    value?: number;
};

declare global {
    interface Window {
        googleAnalyticsMeasurementId?: string;
        gtag?: (command: string, target: string, parameters?: GoogleAnalyticsParameters) => void;
        metaPixelId?: string;
        fbq?: (
            command: string,
            event: string,
            parameters?: MetaPixelParameters,
            options?: { eventID?: string },
        ) => void;
    }
}

export const META_PIXEL_CURRENCY = 'MXN';

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

function trackMetaPixel(
    event: string,
    parameters: MetaPixelParameters = {},
    options?: { eventID?: string },
): void {
    if (!window.metaPixelId || typeof window.fbq !== 'function') {
        return;
    }

    window.fbq('track', event, parameters, options);
}

export function trackMetaPixelPageView(): void {
    trackMetaPixel('PageView');
}

export function trackMetaViewContent(parameters: MetaPixelParameters): void {
    trackMetaPixel('ViewContent', parameters);
}

export function trackMetaAddToCart(parameters: MetaPixelParameters): void {
    trackMetaPixel('AddToCart', parameters);
}

export function trackMetaInitiateCheckout(parameters: MetaPixelParameters): void {
    trackMetaPixel('InitiateCheckout', parameters);
}

export function trackMetaPurchase(parameters: MetaPixelParameters, eventId: string): void {
    trackMetaPixel('Purchase', parameters, { eventID: eventId });
}
