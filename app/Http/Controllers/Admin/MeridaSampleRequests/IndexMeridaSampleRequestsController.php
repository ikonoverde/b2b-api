<?php

namespace App\Http\Controllers\Admin\MeridaSampleRequests;

use App\Http\Controllers\Controller;
use App\Models\MeridaSampleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexMeridaSampleRequestsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $sampleRequests = MeridaSampleRequest::query()
            ->with('user:id,name,email')
            ->when($request->query('search'), function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('business_name', 'like', "%{$search}%")
                        ->orWhere('contact_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->query('status'), fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->through(fn (MeridaSampleRequest $sampleRequest): array => [
                'id' => $sampleRequest->id,
                'business_name' => $sampleRequest->business_name,
                'contact_name' => $sampleRequest->contact_name,
                'email' => $sampleRequest->email,
                'phone' => $sampleRequest->phone,
                'business_type' => $sampleRequest->business_type,
                'client_volume' => $sampleRequest->client_volume,
                'social_url' => $sampleRequest->social_url,
                'products_interested' => $sampleRequest->products_interested,
                'improvement_goals' => $sampleRequest->improvement_goals,
                'status' => $sampleRequest->status,
                'created_at' => $sampleRequest->created_at?->toISOString(),
                'user' => $sampleRequest->user ? [
                    'id' => $sampleRequest->user->id,
                    'name' => $sampleRequest->user->name,
                    'email' => $sampleRequest->user->email,
                ] : null,
            ])
            ->withQueryString();

        return Inertia::render('admin/merida-sample-requests/Index', [
            'sampleRequests' => $sampleRequests,
            'filters' => $request->only('search', 'status'),
        ]);
    }
}
