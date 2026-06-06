import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { trackGoogleAnalyticsPageView } from './utils/analytics';

const appName = import.meta.env.VITE_APP_NAME || 'Ikonoverde';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);

        trackGoogleAnalyticsPageView(props.initialPage.url);

        router.on('navigate', (event) => {
            trackGoogleAnalyticsPageView(event.detail.page.url);
        });
    },
    progress: {
        color: '#4A5D4A',
    },
});
