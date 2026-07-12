<?php

namespace App\Services\Ads;

use Carbon\CarbonImmutable;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

/**
 * Reads the Meta dataset (pixel) node: what Meta actually received.
 *
 * The counterpart to MetaConversionsApiService, which records what we sent. A dispatch this
 * app considers successful and an event Meta actually counted are different facts, and only
 * this service can observe the second one.
 *
 * Needs ads_read. The Conversions API token does not carry it and returns "(#100) Missing
 * Permission" on every read here, so this reads services.meta_ads.access_token.
 *
 * Field and aggregation names below were confirmed against the live Graph API on 2026-07-11
 * (v21.0). Two names that look plausible do NOT exist on this node and will 400 the whole
 * request: `is_active` and `server_last_fired_time`. Use the event_source aggregation to tell
 * browser events from server events instead.
 */
class MetaDatasetService
{
    /**
     * The furthest back Meta will serve stats. Requests beyond it return an empty data array
     * rather than an error, which is indistinguishable from "no events happened".
     */
    public const MAX_LOOKBACK_DAYS = 28;

    public const AGGREGATIONS = [
        'event',
        'event_total_counts',
        'event_source',
        'match_keys',
        'host',
        'url',
        'device_type',
        'device_os',
        'browser_type',
        'had_pii',
        'pixel_fire',
        'event_detection_method',
        'custom_data_field',
        'event_value_count',
        'url_by_rule',
        'event_processing_results',
    ];

    private const FIELDS = 'id,name,creation_time,first_party_cookie_status,last_fired_time,owner_business,data_use_setting,enable_automatic_matching,is_created_by_business,is_unavailable,can_proxy,match_rate_approx';

    public function __construct(
        private ?string $accessToken = null,
        private ?string $datasetId = null,
        private ?string $apiVersion = null,
        private ?string $baseUrl = null,
    ) {}

    /**
     * Dataset configuration and liveness.
     *
     * @return array<string, mixed>
     */
    public function details(?string $datasetId = null): array
    {
        return $this->get($this->datasetId($datasetId), ['fields' => self::FIELDS]);
    }

    /**
     * Total count per event name over the window — PageView, Purchase, ViewContent, and so on.
     *
     * @return array<string, mixed>
     */
    public function eventCounts(?string $datasetId = null, ?string $since = null, ?string $until = null): array
    {
        return $this->stats('event_total_counts', $datasetId, $since, $until);
    }

    /**
     * Browser versus server delivery, bucketed by hour. This is how you tell a pixel event from
     * a Conversions API event; there is no field on the node that reports it.
     *
     * @return array<string, mixed>
     */
    public function eventSources(?string $datasetId = null, ?string $since = null, ?string $until = null): array
    {
        return $this->stats('event_source', $datasetId, $since, $until);
    }

    /**
     * Which match keys arrived with each event — email, phone, fbp, fbc, external_id. Absent
     * keys cap event match quality, and fbp/fbc go missing whenever the buyer blocks fbevents.js.
     *
     * @return array<string, mixed>
     */
    public function matchKeys(?string $datasetId = null, ?string $since = null, ?string $until = null): array
    {
        return $this->stats('match_keys', $datasetId, $since, $until);
    }

    /**
     * @return array<string, mixed>
     */
    public function stats(string $aggregation, ?string $datasetId = null, ?string $since = null, ?string $until = null): array
    {
        if (! in_array($aggregation, self::AGGREGATIONS, true)) {
            return [
                'error' => true,
                'message' => sprintf('Unknown aggregation [%s]. Meta accepts: %s.', $aggregation, implode(', ', self::AGGREGATIONS)),
            ];
        }

        $end = $until ? CarbonImmutable::parse($until) : CarbonImmutable::now();
        $start = $since ? CarbonImmutable::parse($since) : $end->subDays(self::MAX_LOOKBACK_DAYS);
        $earliest = CarbonImmutable::now()->subDays(self::MAX_LOOKBACK_DAYS);

        $truncated = $start->lessThan($earliest);

        $payload = $this->get($this->datasetId($datasetId).'/stats', [
            'aggregation' => $aggregation,
            'start_time' => ($truncated ? $earliest : $start)->getTimestamp(),
            'end_time' => $end->getTimestamp(),
        ]);

        if (isset($payload['error'])) {
            return $payload;
        }

        return [
            ...$payload,
            'window' => [
                'start' => ($truncated ? $earliest : $start)->toIso8601String(),
                'end' => $end->toIso8601String(),
                'truncated_to_max_lookback' => $truncated,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<string, mixed>
     */
    private function get(string $path, array $query = []): array
    {
        try {
            $response = $this->request()->get(ltrim($path, '/'), [
                ...$query,
                'access_token' => $this->token(),
            ]);
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'message' => $exception->getMessage(),
            ];
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            return [
                'error' => true,
                'status' => $response->status(),
                'message' => 'Meta Graph returned a non-JSON response.',
            ];
        }

        if ($response->failed()) {
            return [
                'error' => true,
                'status' => $response->status(),
                'response' => $payload,
            ];
        }

        return $payload;
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl(sprintf(
            '%s/%s',
            rtrim($this->baseUrl ?? config('services.meta_ads.base_url'), '/'),
            $this->apiVersion ?? config('services.meta_ads.api_version'),
        ))
            ->acceptJson()
            ->timeout(15);
    }

    private function datasetId(?string $datasetId): string
    {
        return $datasetId ?: $this->datasetId ?: config('services.meta_ads.dataset_id') ?: throw new RuntimeException('Meta dataset id is not configured.');
    }

    private function token(): string
    {
        return $this->accessToken ?: config('services.meta_ads.access_token') ?: throw new RuntimeException('Meta ads access token is not configured.');
    }
}
