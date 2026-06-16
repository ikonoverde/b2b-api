import './bootstrap';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { trackGoogleAnalyticsPageView, trackMetaPixelPageView } from './utils/analytics';

const appName = import.meta.env.VITE_APP_NAME || 'Ikonoverde';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        if (el.dataset.serverRendered === 'true') {
            hydrateRoot(el, <App {...props} />);
        } else {
            createRoot(el).render(<App {...props} />);
        }

        trackGoogleAnalyticsPageView(props.initialPage.url);
        trackMetaPixelPageView();

        router.on('navigate', (event) => {
            trackGoogleAnalyticsPageView(event.detail.page.url);
            trackMetaPixelPageView();
        });
    },
    progress: {
        color: '#4A5D4A',
    },
});
