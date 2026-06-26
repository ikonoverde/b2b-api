const META_PIXEL_CURRENCY = "MXN";
function trackGoogleAnalyticsEvent(event, parameters = {}) {
  if (!window.googleAnalyticsMeasurementId || typeof window.gtag !== "function") {
    return false;
  }
  window.gtag("event", event, {
    ...parameters,
    send_to: window.googleAnalyticsMeasurementId
  });
  return true;
}
function trackGoogleAnalyticsViewItem(parameters) {
  return trackGoogleAnalyticsEvent("view_item", parameters);
}
function trackGoogleAnalyticsAddToCart(parameters) {
  return trackGoogleAnalyticsEvent("add_to_cart", parameters);
}
function trackGoogleAnalyticsBeginCheckout(parameters) {
  return trackGoogleAnalyticsEvent("begin_checkout", parameters);
}
function trackGoogleAnalyticsPurchase(parameters) {
  return trackGoogleAnalyticsEvent("purchase", parameters);
}
function trackMetaPixel(event, parameters = {}, options) {
  if (!window.metaPixelId || typeof window.fbq !== "function") {
    return false;
  }
  window.fbq("track", event, parameters, options);
  return true;
}
function trackMetaViewContent(parameters) {
  trackMetaPixel("ViewContent", parameters);
}
function trackMetaAddToCart(parameters) {
  trackMetaPixel("AddToCart", parameters);
}
function trackMetaInitiateCheckout(parameters) {
  trackMetaPixel("InitiateCheckout", parameters);
}
function trackMetaPurchase(parameters, eventId) {
  return trackMetaPixel("Purchase", parameters, { eventID: eventId });
}
export {
  META_PIXEL_CURRENCY as M,
  trackMetaAddToCart as a,
  trackGoogleAnalyticsBeginCheckout as b,
  trackMetaInitiateCheckout as c,
  trackGoogleAnalyticsPurchase as d,
  trackMetaPurchase as e,
  trackGoogleAnalyticsViewItem as f,
  trackMetaViewContent as g,
  trackGoogleAnalyticsAddToCart as t
};
