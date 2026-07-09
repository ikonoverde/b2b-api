<?php

namespace App\Services\Ads;

use App\Models\AdProposal;
use Illuminate\Support\Str;

/**
 * Ad proposals are drafted by agents against a loose JSON schema, so the stored
 * creatives use whatever key names the agent settled on. This normalizes those
 * shapes into the exact fields Meta and Google ad units render.
 */
class AdProposalPreviewer
{
    /**
     * @return array{
     *     platform: string,
     *     brand: array{name: string, display_url: string, initial: string},
     *     meta: array<int, array{primary_text: ?string, headline: ?string, description: ?string, cta: string, image_url: ?string, media_note: ?string}>,
     *     google: array<int, array{headlines: array<int, string>, descriptions: array<int, string>, display_url: string, path: ?string, sitelinks: array<int, string>, keywords: array<int, string>, ad_group: ?string}>
     * }
     */
    public function preview(AdProposal $proposal): array
    {
        $brand = [
            'name' => config('app.name'),
            'display_url' => $this->displayUrl($proposal->landing_page_url),
            'initial' => Str::upper(Str::substr((string) config('app.name'), 0, 1)),
        ];

        return [
            'platform' => $proposal->platform,
            'brand' => $brand,
            'meta' => $proposal->platform === 'meta' ? $this->metaAds($proposal) : [],
            'google' => $proposal->platform === 'google' ? $this->googleAds($proposal, $brand['display_url']) : [],
        ];
    }

    /**
     * @return array<int, array{primary_text: ?string, headline: ?string, description: ?string, cta: string, image_url: ?string, media_note: ?string}>
     */
    protected function metaAds(AdProposal $proposal): array
    {
        $ads = [];

        foreach ($this->collectCreatives($proposal) as $creative) {
            $ads[] = [
                'primary_text' => $this->pick($creative, ['primary_text', 'body', 'text', 'copy', 'ad_copy', 'hook']),
                'headline' => $this->pick($creative, ['headline', 'title', 'name']) ?? $this->firstOf($creative, ['headlines']),
                'description' => $this->pick($creative, ['description', 'link_description', 'subtitle']),
                'cta' => $this->pick($creative, ['cta', 'call_to_action', 'cta_text', 'button', 'button_text']) ?? 'Más información',
                'image_url' => $this->pick($creative, ['image_url', 'image', 'media_url', 'visual_url']),
                'media_note' => $this->pick($creative, ['image_notes', 'image_prompt', 'media_notes', 'visual', 'creative_notes', 'video_notes']),
            ];
        }

        if ($ads === []) {
            $ads[] = [
                'primary_text' => $proposal->offer,
                'headline' => $proposal->name,
                'description' => null,
                'cta' => 'Más información',
                'image_url' => null,
                'media_note' => null,
            ];
        }

        return $ads;
    }

    /**
     * @return array<int, array{headlines: array<int, string>, descriptions: array<int, string>, display_url: string, path: ?string, sitelinks: array<int, string>, keywords: array<int, string>, ad_group: ?string}>
     */
    protected function googleAds(AdProposal $proposal, string $displayUrl): array
    {
        $ads = [];

        foreach ($this->collectCreatives($proposal) as $creative) {
            $headlines = $this->stringList($creative['headlines'] ?? null);
            $descriptions = $this->stringList($creative['descriptions'] ?? null);

            if ($headlines === [] && $headline = $this->pick($creative, ['headline', 'title'])) {
                $headlines = [$headline];
            }

            if ($descriptions === [] && $description = $this->pick($creative, ['description', 'body', 'text', 'primary_text'])) {
                $descriptions = [$description];
            }

            $path = $this->pick($creative, ['path', 'display_path', 'path1']);

            $ads[] = [
                'headlines' => array_slice($headlines, 0, 15),
                'descriptions' => array_slice($descriptions, 0, 4),
                'display_url' => $this->pick($creative, ['display_url']) ?? $displayUrl,
                'path' => $path,
                'sitelinks' => array_slice($this->stringList($creative['sitelinks'] ?? null), 0, 6),
                'keywords' => array_slice($this->stringList($creative['keywords'] ?? null), 0, 12),
                'ad_group' => $this->pick($creative, ['ad_group', 'group', 'theme']),
            ];
        }

        if ($ads === []) {
            $ads[] = [
                'headlines' => array_values(array_filter([$proposal->name, $proposal->offer])),
                'descriptions' => array_values(array_filter([$proposal->offer])),
                'display_url' => $displayUrl,
                'path' => null,
                'sitelinks' => [],
                'keywords' => array_slice($this->stringList($proposal->keywords), 0, 12),
                'ad_group' => null,
            ];
        }

        return $ads;
    }

    /**
     * Creatives can live at the top level or nested inside each ad group.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function collectCreatives(AdProposal $proposal): array
    {
        $creatives = [];

        foreach ($this->normalizeCreatives($proposal->creatives) as $creative) {
            $creatives[] = $creative;
        }

        foreach (is_array($proposal->ad_groups) ? $proposal->ad_groups : [] as $adGroup) {
            if (! is_array($adGroup)) {
                continue;
            }

            $groupName = $this->pick($adGroup, ['name', 'ad_group', 'theme', 'title']);
            $groupKeywords = $this->stringList($adGroup['keywords'] ?? null);
            $nested = $adGroup['creatives'] ?? $adGroup['ads'] ?? null;

            foreach ($this->normalizeCreatives($nested) as $creative) {
                $creatives[] = [
                    ...$creative,
                    'ad_group' => $creative['ad_group'] ?? $groupName,
                    'keywords' => $creative['keywords'] ?? $groupKeywords,
                ];
            }
        }

        return $creatives;
    }

    /**
     * Agents sometimes emit a creative as a bare string instead of an object.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeCreatives(mixed $creatives): array
    {
        if (! is_array($creatives)) {
            return [];
        }

        $normalized = [];

        foreach ($creatives as $creative) {
            if (is_string($creative) && trim($creative) !== '') {
                $normalized[] = ['headline' => trim($creative)];

                continue;
            }

            if (is_array($creative)) {
                $normalized[] = $creative;
            }
        }

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $source
     * @param  array<int, string>  $keys
     */
    protected function pick(array $source, array $keys): ?string
    {
        foreach ($keys as $key) {
            $value = $source[$key] ?? null;

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $source
     * @param  array<int, string>  $keys
     */
    protected function firstOf(array $source, array $keys): ?string
    {
        foreach ($keys as $key) {
            $list = $this->stringList($source[$key] ?? null);

            if ($list !== []) {
                return $list[0];
            }
        }

        return null;
    }

    /**
     * @return array<int, string>
     */
    protected function stringList(mixed $value): array
    {
        if (is_string($value) && trim($value) !== '') {
            return [trim($value)];
        }

        if (! is_array($value)) {
            return [];
        }

        $items = [];

        foreach ($value as $item) {
            if (is_string($item) && trim($item) !== '') {
                $items[] = trim($item);

                continue;
            }

            if (is_array($item) && $text = $this->pick($item, ['text', 'title', 'keyword', 'name', 'headline'])) {
                $items[] = $text;
            }
        }

        return $items;
    }

    protected function displayUrl(?string $landingPageUrl): string
    {
        $fallback = (string) parse_url((string) config('app.url'), PHP_URL_HOST);

        if (! $landingPageUrl) {
            return $fallback;
        }

        return (string) (parse_url($landingPageUrl, PHP_URL_HOST) ?: $fallback);
    }
}
