<?php

namespace App\Http\Requests\Web\Products\Concerns;

trait NormalizesProductShippingPackages
{
    protected function prepareShippingPackagesForValidation(): void
    {
        if (! $this->has('shipping_packages')) {
            return;
        }

        $rawPackages = $this->input('shipping_packages', []);

        if (! is_array($rawPackages)) {
            return;
        }

        $packages = collect($rawPackages)
            ->filter(fn ($package): bool => is_array($package) && collect($package)->contains(fn ($value): bool => filled($value)))
            ->map(fn (array $package): array => [
                'quantity' => $package['quantity'] ?? null,
                'weight_kg' => $package['weight_kg'] ?? null,
                'width_cm' => $package['width_cm'] ?? null,
                'height_cm' => $package['height_cm'] ?? null,
                'depth_cm' => $package['depth_cm'] ?? null,
            ])
            ->values()
            ->all();

        $this->merge([
            'shipping_packages' => $packages,
        ]);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    protected function shippingPackageRules(): array
    {
        return [
            'shipping_packages' => ['nullable', 'array', 'max:25'],
            'shipping_packages.*.quantity' => ['required', 'integer', 'min:1', 'max:999', 'distinct'],
            'shipping_packages.*.weight_kg' => ['required', 'numeric', 'min:0.01', 'max:999'],
            'shipping_packages.*.width_cm' => ['required', 'numeric', 'min:0.1', 'max:9999'],
            'shipping_packages.*.height_cm' => ['required', 'numeric', 'min:0.1', 'max:9999'],
            'shipping_packages.*.depth_cm' => ['required', 'numeric', 'min:0.1', 'max:9999'],
        ];
    }
}
