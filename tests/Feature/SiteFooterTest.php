<?php

use Symfony\Component\Process\Process;

it('renders the shared footer through every app shell', function () {
    $mockPath = storage_path('framework/testing/inertia-react-mock.mjs');

    if (! is_dir(dirname($mockPath))) {
        mkdir(dirname($mockPath), 0755, true);
    }

    file_put_contents($mockPath, <<<'JS'
import React from 'react';

export function Head({ title, children }) {
  return React.createElement(React.Fragment, null, title ? React.createElement('title', null, title) : null, children ?? null);
}

export function Link({ href, children, prefetch, ...props }) {
  return React.createElement('a', { ...props, href: typeof href === 'string' ? href : '#' }, children);
}

export function usePage() {
  return {
    props: {
      auth: { user: null },
      miniCart: { items: [], subtotal: 0, totalCount: 0 },
      contact: { phone: '984 156 9014', whatsappUrl: 'https://wa.me/529841569014' },
    },
  };
}

export function useForm() {
  return { post: () => undefined, processing: false };
}
JS);

    $script = <<<'JS'
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resolve } from 'node:path';

const mockPath = resolve('storage/framework/testing/inertia-react-mock.mjs');
const vite = await createServer({
  resolve: { alias: { '@inertiajs/react': mockPath } },
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
});

const layouts = [
  ['PublicShell', '/resources/js/Layouts/PublicShell.tsx', { title: 'Test' }],
  ['AuthShell', '/resources/js/Layouts/AuthShell.tsx', { title: 'Test', eyebrow: 'Cuenta', headline: 'Ingresar', sub: 'Acceso' }],
  ['CustomerShell', '/resources/js/Layouts/CustomerShell.tsx', { title: 'Test' }],
  ['PublicLayout', '/resources/js/Layouts/PublicLayout.tsx', { title: 'Test', auth: { user: null } }],
  ['CustomerLayout', '/resources/js/Layouts/CustomerLayout.tsx', { title: 'Test' }],
];

try {
  for (const [name, path, props] of layouts) {
    const mod = await vite.ssrLoadModule(path);
    const html = renderToStaticMarkup(
      React.createElement(mod.default, props, React.createElement('main', null, `${name} body`)),
    );

    for (const expected of ['Comprar ahora', 'Sin mínimo', 'Precios visibles', 'WhatsApp', 'Escríbenos']) {
      if (!html.includes(expected)) {
        throw new Error(`${name} rendered without footer text: ${expected}`);
      }
    }
  }
} finally {
  await vite.close();
}
JS;

    $process = new Process(['node', '--input-type=module'], base_path());
    $process->setInput($script);
    $process->setTimeout(30);
    $process->run();

    if (! $process->isSuccessful()) {
        $this->fail(trim($process->getOutput().PHP_EOL.$process->getErrorOutput()));
    }

    expect($process->isSuccessful())->toBeTrue();
});
