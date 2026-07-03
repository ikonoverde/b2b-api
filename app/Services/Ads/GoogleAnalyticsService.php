<?php

namespace App\Services\Ads;

use Google\Analytics\Admin\V1beta\Client\AnalyticsAdminServiceClient;
use Google\Analytics\Admin\V1beta\GetPropertyRequest;
use Google\Analytics\Admin\V1beta\ListAccountSummariesRequest;
use Google\Analytics\Admin\V1beta\ListCustomDimensionsRequest;
use Google\Analytics\Admin\V1beta\ListCustomMetricsRequest;
use Google\Analytics\Admin\V1beta\ListGoogleAdsLinksRequest;
use Google\Analytics\Data\V1alpha\Client\AlphaAnalyticsDataClient;
use Google\Analytics\Data\V1alpha\RunFunnelReportRequest;
use Google\Analytics\Data\V1alpha\RunReportRequest as AlphaRunReportRequest;
use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\RunRealtimeReportRequest;
use Google\Analytics\Data\V1beta\RunReportRequest;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Google\Auth\FetchAuthTokenInterface;
use Google\Protobuf\Internal\Message;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class GoogleAnalyticsService
{
    private ?FetchAuthTokenInterface $credentials = null;

    public function __construct(
        private ?AnalyticsAdminServiceClient $adminClient = null,
        private ?BetaAnalyticsDataClient $dataClient = null,
        private ?AlphaAnalyticsDataClient $alphaDataClient = null,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function accountSummaries(): array
    {
        try {
            $summaries = $this->adminClient()->listAccountSummaries(new ListAccountSummariesRequest);

            return [
                'account_summaries' => $this->pagedItemsToArray($summaries),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function propertyDetails(string|int|null $propertyId = null): array
    {
        try {
            $property = $this->adminClient()->getProperty(new GetPropertyRequest([
                'name' => $this->propertyName($propertyId),
            ]));

            return [
                'property' => $this->messageToArray($property),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function googleAdsLinks(string|int|null $propertyId = null): array
    {
        try {
            $links = $this->adminClient()->listGoogleAdsLinks(new ListGoogleAdsLinksRequest([
                'parent' => $this->propertyName($propertyId),
            ]));

            return [
                'google_ads_links' => $this->pagedItemsToArray($links),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function customDimensionsAndMetrics(string|int|null $propertyId = null): array
    {
        try {
            $parent = $this->propertyName($propertyId);

            return [
                'custom_dimensions' => $this->pagedItemsToArray($this->adminClient()->listCustomDimensions(new ListCustomDimensionsRequest([
                    'parent' => $parent,
                ]))),
                'custom_metrics' => $this->pagedItemsToArray($this->adminClient()->listCustomMetrics(new ListCustomMetricsRequest([
                    'parent' => $parent,
                ]))),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function runReport(array $arguments): array
    {
        try {
            $request = new RunReportRequest;
            $request->mergeFromJsonString(json_encode($this->reportPayload($arguments), JSON_THROW_ON_ERROR), true);

            return [
                'report' => $this->messageToArray($this->dataClient()->runReport($request)),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function runConversionsReport(array $arguments): array
    {
        try {
            $payload = $this->reportPayload($arguments);

            if (isset($arguments['conversion_spec'])) {
                $payload['conversionSpec'] = $this->normalizeKeys($arguments['conversion_spec']);
            }

            $request = new AlphaRunReportRequest;
            $request->mergeFromJsonString(json_encode($payload, JSON_THROW_ON_ERROR), true);

            return [
                'report' => $this->messageToArray($this->alphaDataClient()->runReport($request)),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function runRealtimeReport(array $arguments): array
    {
        try {
            $payload = $this->reportPayload($arguments, includeDateRanges: false);
            unset($payload['currencyCode']);

            $request = new RunRealtimeReportRequest;
            $request->mergeFromJsonString(json_encode($payload, JSON_THROW_ON_ERROR), true);

            return [
                'realtime_report' => $this->messageToArray($this->dataClient()->runRealtimeReport($request)),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function runFunnelReport(array $arguments): array
    {
        try {
            $payload = [
                'property' => $this->propertyName($arguments['property_id'] ?? null),
                'dateRanges' => $this->dateRanges($arguments['date_ranges'] ?? []),
                'funnel' => [
                    'steps' => $this->funnelSteps($arguments['funnel_steps'] ?? []),
                ],
            ];

            foreach (['funnel_breakdown', 'funnel_next_action', 'segments', 'return_property_quota'] as $key) {
                if (array_key_exists($key, $arguments)) {
                    $payload[$this->camel($key)] = $this->normalizeKeys($arguments[$key]);
                }
            }

            $request = new RunFunnelReportRequest;
            $request->mergeFromJsonString(json_encode($payload, JSON_THROW_ON_ERROR), true);

            return [
                'funnel_report' => $this->messageToArray($this->alphaDataClient()->runFunnelReport($request)),
            ];
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function propertyAnnotations(string|int|null $propertyId = null): array
    {
        try {
            $token = $this->accessToken();
            $property = $this->propertyName($propertyId);
            $response = Http::baseUrl('https://analyticsadmin.googleapis.com')
                ->withToken($token)
                ->acceptJson()
                ->timeout(15)
                ->get("/v1alpha/{$property}/annotations");

            $payload = $response->json();

            if (! is_array($payload)) {
                return [
                    'error' => true,
                    'status' => $response->status(),
                    'message' => 'Google Analytics Admin returned a non-JSON annotations response.',
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
        } catch (Throwable $exception) {
            return $this->error($exception);
        }
    }

    private function adminClient(): AnalyticsAdminServiceClient
    {
        return $this->adminClient ??= new AnalyticsAdminServiceClient($this->clientOptions());
    }

    private function dataClient(): BetaAnalyticsDataClient
    {
        return $this->dataClient ??= new BetaAnalyticsDataClient($this->clientOptions());
    }

    private function alphaDataClient(): AlphaAnalyticsDataClient
    {
        return $this->alphaDataClient ??= new AlphaAnalyticsDataClient($this->clientOptions());
    }

    /**
     * @return array<string, mixed>
     */
    private function clientOptions(): array
    {
        return array_filter([
            'transport' => 'rest',
            'credentials' => $this->credentials(),
        ]);
    }

    private function credentials(): ?FetchAuthTokenInterface
    {
        if ($this->credentials !== null) {
            return $this->credentials;
        }

        $json = $this->credentialsJson();

        if ($json === null) {
            return null;
        }

        return $this->credentials = new ServiceAccountCredentials([
            'https://www.googleapis.com/auth/analytics.readonly',
        ], $json);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function credentialsJson(): ?array
    {
        $credentialsJson = config('services.google_analytics.credentials_json');

        if (is_string($credentialsJson) && trim($credentialsJson) !== '') {
            $decoded = json_decode($credentialsJson, true);

            if (is_array($decoded)) {
                return $decoded;
            }
        }

        $credentialsPath = config('services.google_analytics.credentials_path');

        if (is_string($credentialsPath) && is_file($credentialsPath)) {
            $decoded = json_decode((string) file_get_contents($credentialsPath), true);

            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    private function accessToken(): string
    {
        $credentials = $this->credentials() ?: throw new RuntimeException('Google Analytics service-account credentials are not configured.');
        $token = $credentials->fetchAuthToken();

        if (! is_string($token['access_token'] ?? null)) {
            throw new RuntimeException('Unable to fetch a Google Analytics access token.');
        }

        return $token['access_token'];
    }

    private function propertyName(string|int|null $propertyId): string
    {
        $propertyId ??= config('services.google_analytics.default_property_id');

        if (! is_string($propertyId) && ! is_int($propertyId)) {
            throw new RuntimeException('Google Analytics property id is not configured.');
        }

        $propertyId = trim((string) $propertyId);

        if ($propertyId === '') {
            throw new RuntimeException('Google Analytics property id is not configured.');
        }

        return str_starts_with($propertyId, 'properties/') ? $propertyId : "properties/{$propertyId}";
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function reportPayload(array $arguments, bool $includeDateRanges = true): array
    {
        $payload = [
            'property' => $this->propertyName($arguments['property_id'] ?? null),
            'dimensions' => $this->namedItems($arguments['dimensions'] ?? []),
            'metrics' => $this->namedItems($arguments['metrics'] ?? []),
        ];

        if ($includeDateRanges) {
            $payload['dateRanges'] = $this->dateRanges($arguments['date_ranges'] ?? []);
        }

        foreach (['dimension_filter', 'metric_filter', 'order_bys', 'limit', 'offset', 'currency_code', 'return_property_quota'] as $key) {
            if (array_key_exists($key, $arguments)) {
                $payload[$this->camel($key)] = $this->normalizeKeys($arguments[$key]);
            }
        }

        return $payload;
    }

    /**
     * @param  array<int, mixed>  $items
     * @return array<int, array{name: string}>
     */
    private function namedItems(array $items): array
    {
        return collect($items)
            ->map(fn (mixed $item): array => is_array($item) ? $this->normalizeKeys($item) : ['name' => (string) $item])
            ->values()
            ->all();
    }

    /**
     * @param  array<int, mixed>  $dateRanges
     * @return array<int, array<string, mixed>>
     */
    private function dateRanges(array $dateRanges): array
    {
        return collect($dateRanges)
            ->map(fn (mixed $dateRange): array => is_array($dateRange) ? $this->normalizeKeys($dateRange) : [])
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param  array<int, mixed>  $steps
     * @return array<int, array<string, mixed>>
     */
    private function funnelSteps(array $steps): array
    {
        return collect($steps)
            ->map(function (mixed $step): array {
                if (! is_array($step)) {
                    return [];
                }

                if (isset($step['event']) && ! isset($step['filter_expression'])) {
                    $step['filter_expression'] = [
                        'funnel_event_filter' => [
                            'event_name' => $step['event'],
                        ],
                    ];
                    unset($step['event']);
                }

                return $this->normalizeKeys($step);
            })
            ->filter()
            ->values()
            ->all();
    }

    private function normalizeKeys(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        if (array_is_list($value)) {
            return array_map(fn (mixed $item): mixed => $this->normalizeKeys($item), $value);
        }

        $normalized = [];

        foreach ($value as $key => $item) {
            $normalized[$this->camel((string) $key)] = $this->normalizeKeys($item);
        }

        return $normalized;
    }

    private function camel(string $key): string
    {
        return lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $key))));
    }

    /**
     * @param  iterable<mixed>  $items
     * @return array<int, mixed>
     */
    private function pagedItemsToArray(iterable $items): array
    {
        $rows = [];

        foreach ($items as $item) {
            $rows[] = $item instanceof Message ? $this->messageToArray($item) : $item;
        }

        return $rows;
    }

    /**
     * @return array<string, mixed>
     */
    private function messageToArray(Message $message): array
    {
        return json_decode($message->serializeToJsonString(), true, flags: JSON_THROW_ON_ERROR);
    }

    /**
     * @return array<string, mixed>
     */
    private function error(Throwable $exception): array
    {
        return [
            'error' => true,
            'message' => $exception->getMessage(),
        ];
    }
}
