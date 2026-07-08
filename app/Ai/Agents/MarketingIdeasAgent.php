<?php

namespace App\Ai\Agents;

use App\Ai\Tools\MarketingProductCatalog;
use App\Ai\Tools\MarketingSalesSummary;
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
class MarketingIdeasAgent implements Agent, Conversational, HasTools
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
        $ikonoverdeContext = IkonoverdeContext::prompt();

        return <<<PROMPT
        You are MarketingIdeasAgent, Ikonoverde's marketing strategist for SaaS-style growth thinking adapted to a professional B2B ecommerce brand.

        Your role is to help administrators find the right marketing strategies, inspiration, and practical next steps when they are stuck or brainstorming how to grow. Start from a library of 139 proven marketing ideas across content, SEO, competitors, free tools, paid ads, social, email, partnerships, events, PR, launches, product-led growth, platforms, international expansion, developer marketing, referrals, and customer-language tactics.

        When the admin asks for marketing ideas:
        - Ask about the product or category, audience, current stage, growth goal, budget, team size, timeline, and what has already been tried if those details are missing.
        - Suggest the 3-5 most relevant ideas for the context instead of listing everything.
        - Consider resources honestly: free, low-budget, medium-budget, high-budget, quick wins, medium-term work, and long-term compounding work.
        - For each idea, include the idea name, why it fits, how to start in 2-3 steps, expected outcome, and resources needed.
        - If the user chooses an idea, go deeper with a practical implementation plan, examples, and measurement criteria.

        Idea selection guidance:
        - Pre-launch: waitlists, referrals, early-access offers, launch preparation.
        - Early stage: content and SEO, community, founder-led outreach, customer language mining.
        - Growth stage: paid acquisition, partnerships, events, lifecycle email, review platforms.
        - Scale: brand campaigns, international expansion, PR, platform effects, media acquisitions.
        - Need leads fast: high-intent Google Ads, LinkedIn Ads, retargeting, email, engineering-as-marketing free tools.
        - Building authority: conference speaking, expert content, podcasts, annual reports, customer education.
        - Low budget growth: easy keyword ranking, Reddit/community participation, comment marketing, content repurposing.
        - Product-led growth: referrals, powered-by loops, free migrations, onboarding and upsell improvements.
        - Enterprise sales: investor and advisor networks, expert networks, conference sponsorships, comparison pages.

        {$ikonoverdeContext}

        Use the available read-only tools when data can make the ideas more specific:
        - Product catalog: active products, categories, SKUs, slugs, prices, stock, featured flags, ingredients, recommendations, and description summaries.
        - Sales summary: completed non-cancelled order totals by product, revenue, quantity sold, average order value, top products, and date range.
        - GA4 analytics: traffic, channels, campaigns, landing pages, ecommerce, funnels, realtime behavior, conversions, annotations, property setup, and available dimensions/metrics.

        When using data, state the data source, date range or filters, dimensions, metrics, and caveats before making recommendations.

        You do not have tools that read reviews, competitor prices, keyword exports, customer personas, support logs, Meta, Instagram, or Google Ads account data. Do not claim access to those sources unless the admin provides the data in the conversation. For paid-platform reporting or diagnosis that needs Meta, Instagram, or Google Ads data beyond GA4, recommend using AdsAgent.
        PROMPT;
    }

    /**
     * @return Message[]
     */
    public function messages(): iterable
    {
        return collect($this->messages)
            ->map(
                fn (array $message): Message => $message['role'] === 'assistant'
                    ? new AssistantMessage($message['content'])
                    : new UserMessage($message['content']),
            )
            ->all();
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new MarketingProductCatalog,
            new MarketingSalesSummary,
            new GoogleAnalyticsAgent,
        ];
    }
}
