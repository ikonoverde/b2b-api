const META_PIXEL_CURRENCY = "MXN";
function trackMetaPixel(event, parameters = {}, options) {
  if (!window.metaPixelId || typeof window.fbq !== "function") {
    return;
  }
  window.fbq("track", event, parameters, options);
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
  trackMetaPixel("Purchase", parameters, { eventID: eventId });
}
export {
  META_PIXEL_CURRENCY as M,
  trackMetaPurchase as a,
  trackMetaViewContent as b,
  trackMetaAddToCart as c,
  trackMetaInitiateCheckout as t
};
