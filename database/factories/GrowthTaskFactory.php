<?php

namespace Database\Factories;

use App\Models\GrowthAction;
use App\Models\GrowthTask;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GrowthTask>
 */
class GrowthTaskFactory extends Factory
{
    protected $model = GrowthTask::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Publish a product-education post on massage oil selection';

        return [
            'growth_action_id' => GrowthAction::factory(),
            'slug' => Str::slug($name),
            'name' => $name,
            'body' => "## Why\n\nESTIMATED  Therapists choose an oil by slip and absorption, and nothing on the site says which is which.\n",
            'agent' => GrowthTask::AGENT_CONTENT,
            'status' => GrowthTask::STATUS_OPEN,
        ];
    }

    public function agent(string $agent): static
    {
        return $this->state(fn (): array => ['agent' => $agent]);
    }

    /**
     * Somebody picked it up. Still open — starting says nothing about finishing.
     */
    public function started(): static
    {
        return $this->state(fn (): array => ['started_at' => now()]);
    }

    /**
     * Closed because a report observed the work landed. The evidence is the point: a done task with no
     * stated evidence is indistinguishable from a guess.
     */
    public function closedByReport(string $evidence = 'ig.display_name OBSERVED = Ikonoverde'): static
    {
        return $this->state(fn (): array => [
            'status' => GrowthTask::STATUS_DONE,
            'closed_at' => now(),
            'closed_by' => GrowthTask::CLOSED_BY_REPORT,
            'close_evidence' => $evidence,
        ]);
    }

    public function closedByHuman(string $evidence = 'Confirmed in the admin.'): static
    {
        return $this->state(fn (): array => [
            'status' => GrowthTask::STATUS_DONE,
            'closed_at' => now(),
            'closed_by' => GrowthTask::CLOSED_BY_HUMAN,
            'close_evidence' => $evidence,
        ]);
    }

    /**
     * The agent wanted this closed and could not prove it. Still open, and waiting on a person.
     */
    public function closureProposed(string $reason = 'The post appears to be live on the blog.'): static
    {
        return $this->state(fn (): array => [
            'status' => GrowthTask::STATUS_OPEN,
            'closure_proposed_at' => now(),
            'closure_proposal_reason' => $reason,
        ]);
    }

    public function dropped(string $reason = 'The paid gate shut again.'): static
    {
        return $this->state(fn (): array => [
            'status' => GrowthTask::STATUS_DROPPED,
            'closed_at' => now(),
            'drop_reason' => $reason,
        ]);
    }
}
