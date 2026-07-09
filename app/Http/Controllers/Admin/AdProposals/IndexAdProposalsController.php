<?php

namespace App\Http\Controllers\Admin\AdProposals;

use App\Http\Controllers\Controller;
use App\Models\AdProposal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAdProposalsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $proposals = AdProposal::query()
            ->when($request->query('search'), function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('objective', 'like', "%{$search}%")
                        ->orWhere('offer', 'like', "%{$search}%");
                });
            })
            ->when($request->query('platform'), fn ($query, string $platform) => $query->where('platform', $platform))
            ->when($request->query('status'), fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->through(fn (AdProposal $proposal): array => [
                'id' => $proposal->id,
                'platform' => $proposal->platform,
                'name' => $proposal->name,
                'objective' => $proposal->objective,
                'status' => $proposal->status,
                'budget_amount' => $proposal->budget_amount,
                'budget_period' => $proposal->budget_period,
                'currency' => $proposal->currency,
                'start_date' => $proposal->start_date?->toDateString(),
                'end_date' => $proposal->end_date?->toDateString(),
                'created_by_agent' => $proposal->created_by_agent,
                'created_at' => $proposal->created_at?->toISOString(),
            ])
            ->withQueryString();

        return Inertia::render('admin/ad-proposals/Index', [
            'proposals' => $proposals,
            'filters' => $request->only('search', 'platform', 'status'),
        ]);
    }
}
