import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "IkonoverdePro";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Account.tsx": () => import("./assets/Account-Cvlk2GIT.js"), "./Pages/Account/Notifications.tsx": () => import("./assets/Notifications-CXsNyYCH.js"), "./Pages/Account/Profile.tsx": () => import("./assets/Profile-DT_DNUsS.js"), "./Pages/Addresses.tsx": () => import("./assets/Addresses-Clp8xTCL.js"), "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-OJS9bWPu.js"), "./Pages/Auth/GoogleCompleteRegistration.tsx": () => import("./assets/GoogleCompleteRegistration-Ov0boxx9.js"), "./Pages/Auth/Login.tsx": () => import("./assets/Login-C43vT1PG.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-DXd5wOlI.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-irknPuQ7.js"), "./Pages/Cart.tsx": () => import("./assets/Cart-CGlBTZw7.js"), "./Pages/Catalog.tsx": () => import("./assets/Catalog-Dg6isaws.js"), "./Pages/Categories.tsx": () => import("./assets/Categories-B1x3ngo8.js"), "./Pages/Checkout/Payment.tsx": () => import("./assets/Payment-CbG_uOBN.js"), "./Pages/Checkout/Shipping.tsx": () => import("./assets/Shipping-BHKcP64x.js"), "./Pages/Checkout/ThankYou.tsx": () => import("./assets/ThankYou-CbAIbWWl.js"), "./Pages/Content/Banners.tsx": () => import("./assets/Banners-Urq1VH1_.js"), "./Pages/Content/FeaturedProducts.tsx": () => import("./assets/FeaturedProducts-DmEv0Kg3.js"), "./Pages/Content/StaticPages.tsx": () => import("./assets/StaticPages-xPgB-Fig.js"), "./Pages/Content/StaticPages/Edit.tsx": () => import("./assets/Edit-DFmYCqcv.js"), "./Pages/CustomerDashboard.tsx": () => import("./assets/CustomerDashboard-CGG2uxm8.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-C0jScgK7.js"), "./Pages/Error.tsx": () => import("./assets/Error-DHDt9Auh.js"), "./Pages/Home.tsx": () => import("./assets/Home-Dk2GrGXS.js"), "./Pages/Orders/Index.tsx": () => import("./assets/Index-xlXxzL45.js"), "./Pages/Orders/Show.tsx": () => import("./assets/Show-B_HWaG9_.js"), "./Pages/PaymentMethods.tsx": () => import("./assets/PaymentMethods-CcJsaod6.js"), "./Pages/Product/Show.tsx": () => import("./assets/Show-DQpxVHws.js"), "./Pages/Products.tsx": () => import("./assets/Products-gQgC-Bwu.js"), "./Pages/Products/Create.tsx": () => import("./assets/Create-CaFQzcZA.js"), "./Pages/Products/Edit.tsx": () => import("./assets/Edit-COY99jJR.js"), "./Pages/Products/components/BasicInfoCard.tsx": () => import("./assets/BasicInfoCard-DUl2Poqc.js"), "./Pages/Products/components/CategoryDropdown.tsx": () => import("./assets/CategoryDropdown-LCDDgS9l.js"), "./Pages/Products/components/ImageSection.tsx": () => import("./assets/ImageSection-CSsqV-Zx.js"), "./Pages/Products/components/PricingInventoryCard.tsx": () => import("./assets/PricingInventoryCard-C7okmkMR.js"), "./Pages/Products/components/ProductFormHeader.tsx": () => import("./assets/ProductFormHeader-B-3p6RCs.js"), "./Pages/Products/components/ShippingDimensionsCard.tsx": () => import("./assets/ShippingDimensionsCard-mTz3hsad.js"), "./Pages/Products/components/StatusCard.tsx": () => import("./assets/StatusCard-Cy1NVGJC.js"), "./Pages/Products/components/ToggleSwitch.tsx": () => import("./assets/ToggleSwitch-CFm40GDN.js"), "./Pages/StaticPage.tsx": () => import("./assets/StaticPage-BA3AvWrN.js"), "./Pages/admin/businesses/Index.tsx": () => import("./assets/Index-_QCXDDZq.js"), "./Pages/admin/orders/Index.tsx": () => import("./assets/Index-DDRndWr5.js"), "./Pages/admin/orders/NotesSection.tsx": () => import("./assets/NotesSection-BmV-ygXs.js"), "./Pages/admin/orders/OrderItemsTable.tsx": () => import("./assets/OrderItemsTable-P2cVj-a-.js"), "./Pages/admin/orders/RefundModal.tsx": () => import("./assets/RefundModal-DiH1IJz_.js"), "./Pages/admin/orders/Show.tsx": () => import("./assets/Show-pGNnS0QK.js"), "./Pages/admin/orders/StatusChangeModal.tsx": () => import("./assets/StatusChangeModal-Cp6RzVv0.js"), "./Pages/admin/orders/StatusHistoryTimeline.tsx": () => import("./assets/StatusHistoryTimeline-DigLU9gs.js"), "./Pages/admin/settings/Index.tsx": () => import("./assets/Index-veVWD2WG.js"), "./Pages/admin/users/Index.tsx": () => import("./assets/Index-D66V5IeV.js"), "./Pages/admin/users/Show.tsx": () => import("./assets/Show-DxIwB182.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
