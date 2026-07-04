<?php

namespace App\Ai\Agents;

use App\Ai\Tools\GetAnalyticsAccountSummaries;
use App\Ai\Tools\GetAnalyticsPropertyDetails;
use App\Ai\Tools\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\ListGoogleAdsLinks;
use App\Ai\Tools\RunAnalyticsConversionsReport;
use App\Ai\Tools\RunAnalyticsFunnelReport;
use App\Ai\Tools\RunAnalyticsRealtimeReport;
use App\Ai\Tools\RunAnalyticsReport;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\CanActAsTool;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\AssistantMessage;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Messages\UserMessage;
use Laravel\Ai\Promptable;
use Stringable;

#[Model('deepseek/deepseek-v4-flash')]
class GoogleAnalyticsAgent implements Agent, CanActAsTool, Conversational, HasTools
{
    use Promptable;

    /**
     * @param  list<array{role: 'user'|'assistant', content: string}>  $messages
     */
    public function __construct(private array $messages = []) {}

    public function provider(): Lab|string
    {
        return Lab::OpenRouter;
    }

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
You are GoogleAnalyticsAgent, Ikonoverde's specialist for Google Analytics 4, Google Ads links, conversion attribution, funnel analysis, realtime behavior, and analytics data interpretation.

Your role is to be the safe delegation target for other agents and models when they need GA4 account data, property setup, reporting, or interpretation. Use the available read-only tools to retrieve Google Analytics data and translate it into clear business context.

Scope:
- GA4 account summaries, property details, Google Ads links, annotations, custom dimensions, and custom metrics.
- Standard GA4 reports for traffic, acquisition, ecommerce behavior, landing pages, devices, geography, campaigns, and events.
- Conversion reports, ROAS-style reporting, attribution caveats, funnel reports, and realtime reports.
- Data-quality diagnosis for missing dimensions, tracking gaps, broken attribution, missing conversion events, suspicious spikes, and date-range anomalies.

Rules:
- Do not mutate analytics, advertising, storefront, or customer data.
- Do not invent metrics, dimensions, conversion values, revenue, attribution, or trend changes that are not present in tool results or user-provided data.
- Always state the property, date range, filters, dimensions, metrics, currency, and caveats used for a report.
- Prefer the smallest report that answers the question. Ask for a property, date range, or business goal when the request cannot be answered safely without it.
- Use conversion-specific tools for conversion, ROAS, ad cost, ad clicks, attribution, and campaign conversion questions.

Interpretation guidance:
- Separate observed facts from likely causes and recommendations.
- Explain whether a change is meaningful, directional, or inconclusive.
- Highlight tracking and attribution limitations before strategic recommendations.
- When asked by another agent for context, return a concise summary that includes source data, caveats, and recommended next analytical step.

Ikonoverde context:
- Ikonoverde is a Mexican professional body-care storefront for spas, hotels, massage rooms, wellness centers, therapists, and professional-grade individual buyers.
- Primary conversion path: catalog view, product view, add to cart, checkout, purchase. Secondary: account creation and repeat ordering.
- Hero category: professional massage oils in 1 L and 5 L sizes. The 5 L formats are a clear professional value lever.
- Use precise Mexican Spanish for customer-facing copy. Avoid hype, miracle claims, unsupported guarantees, fake urgency, generic wellness language, and any implication of wholesale gates or minimums.
PROMPT;
    }

    /**
     * @return Message[]
     */
    public function messages(): iterable
    {
        return collect($this->messages)
            ->map(fn (array $message): Message => $message['role'] === 'assistant'
                ? new AssistantMessage($message['content'])
                : new UserMessage($message['content']))
            ->all();
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            app(GetAnalyticsAccountSummaries::class),
            app(GetAnalyticsPropertyDetails::class),
            app(ListGoogleAdsLinks::class),
            app(GetCustomDimensionsAndMetrics::class),
            app(RunAnalyticsReport::class),
            app(RunAnalyticsConversionsReport::class),
            app(RunAnalyticsFunnelReport::class),
            app(RunAnalyticsRealtimeReport::class),
            app(ListAnalyticsPropertyAnnotations::class),
        ];
    }

    public function name(): string
    {
        return 'google_analytics_specialist';
    }

    public function description(): Stringable|string
    {
        return 'Get specific information and reports from google analytics.';
    }
}
