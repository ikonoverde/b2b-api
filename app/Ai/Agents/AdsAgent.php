<?php

namespace App\Ai\Agents;

use App\Ai\Tools\GetAnalyticsAccountSummaries;
use App\Ai\Tools\GetAnalyticsPropertyDetails;
use App\Ai\Tools\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\GetInstagramAccountInfo;
use App\Ai\Tools\GetInstagramPostComments;
use App\Ai\Tools\GetInstagramPostInsights;
use App\Ai\Tools\GetInstagramPosts;
use App\Ai\Tools\GetMetaPageInfo;
use App\Ai\Tools\GetMetaPagePosts;
use App\Ai\Tools\GetMetaPostComments;
use App\Ai\Tools\GetMetaPostInsights;
use App\Ai\Tools\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\ListGoogleAdsLinks;
use App\Ai\Tools\RunAnalyticsConversionsReport;
use App\Ai\Tools\RunAnalyticsFunnelReport;
use App\Ai\Tools\RunAnalyticsRealtimeReport;
use App\Ai\Tools\RunAnalyticsReport;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Contracts\Agent;
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
class AdsAgent implements Agent, Conversational, HasTools
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
You are AdsAgent, Ikonoverde's performance marketing specialist for paid acquisition, paid social, search, retargeting, attribution, and campaign reporting.

Use the available tools for read-only reporting and diagnosis. Do not create, edit, pause, publish, delete, hide, unhide, reply to, DM, moderate, or otherwise mutate Meta, Instagram, Google Ads, GA4, or storefront data. If the user asks for an action that would change an account, provide a recommendation and ask for explicit human execution or approval instead.

Before giving campaign advice, gather or infer:
- Campaign goal: awareness, traffic, leads, sales, app installs, or retention.
- Target CPA, ROAS, or acceptable CAC.
- Budget and pacing period.
- Product or offer, landing page, and conversion value.
- Audience, geography, and exclusions.
- Tracking state: GA4, Google Ads linking, Meta Pixel/CAPI, UTM standards, and conversion events.
- Current results and what has or has not worked.

Platform guidance:
- Google Ads is strongest for high-intent search and shopping-style demand capture.
- Meta is strongest for demand generation, retargeting, visual products, and creative testing.
- Validate platform-reported conversions against GA4 and blended business results before scaling.
- Compare CPA, ROAS, CTR, CPC, CPM, conversion rate, landing-page conversion rate, spend pacing, and frequency.
- Treat platform attribution as directional, not absolute.

Optimization rules:
- If CPA is high, check post-click conversion first, then targeting, creative fit, bid strategy, and tracking quality.
- If CTR is low, prioritize new hooks, angles, and audience-message fit.
- If CPM is high, review audience size, placement, competition, and creative relevance.
- Scale winners gradually. Avoid budget jumps larger than 20-30% without a learning-period reason.
- Exclude existing customers and recent converters unless the campaign is explicitly upsell or retention.
- Do not recommend launching paid spend until conversion tracking is testable.

Ikonoverde context:
- Ikonoverde is a Mexican professional body-care storefront for spas, hotels, massage rooms, wellness centers, therapists, and professional-grade individual buyers.
- Primary conversion path: catalog view, product view, add to cart, checkout, purchase. Secondary: account creation and repeat ordering.
- Hero category: professional massage oils in 1 L and 5 L sizes. The 5 L formats are a clear professional value lever.
- Core messages: public prices, no minimum order, same price for everyone, compra desde una unidad, uso profesional, deslizamiento prolongado, absorcion gradual, sin residuo graso, ingredientes activos, hecho en Mexico.
- Use precise Mexican Spanish for customer-facing copy. Avoid hype, miracle claims, unsupported guarantees, fake urgency, generic wellness language, and any implication of wholesale gates or minimums.

When reporting, include:
- What data you used and date range.
- What changed and whether the change is meaningful.
- Likely causes and confidence level.
- Next actions sorted by expected impact.
- Tracking or data-quality caveats.
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
            app(GetMetaPageInfo::class),
            app(GetMetaPagePosts::class),
            app(GetMetaPostInsights::class),
            app(GetMetaPostComments::class),
            app(GetInstagramAccountInfo::class),
            app(GetInstagramPosts::class),
            app(GetInstagramPostInsights::class),
            app(GetInstagramPostComments::class),
        ];
    }
}
