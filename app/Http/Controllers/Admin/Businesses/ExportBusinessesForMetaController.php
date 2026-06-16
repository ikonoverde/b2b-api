<?php

namespace App\Http\Controllers\Admin\Businesses;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportBusinessesForMetaController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        $search = $request->query('search');

        return response()->streamDownload(function () use ($search): void {
            $handle = fopen('php://output', 'w');

            if ($handle === false) {
                return;
            }

            fputcsv($handle, ['email', 'phone', 'zip', 'ct', 'st', 'country', 'extern_id']);

            Business::query()
                ->when(is_string($search) && $search !== '', fn (Builder $query) => $query->search($search))
                ->orderBy('name')
                ->chunk(500, function ($businesses) use ($handle): void {
                    foreach ($businesses as $business) {
                        fputcsv($handle, [
                            $this->firstEmail($business->emails),
                            $business->phone ?? '',
                            $business->postal_code ?? '',
                            $business->city ?? '',
                            $business->state ?? '',
                            strtoupper($business->country_code ?? ''),
                            $business->place_id,
                        ]);
                    }
                });

            fclose($handle);
        }, 'meta-businesses.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * @param  array<int, mixed>|null  $emails
     */
    private function firstEmail(?array $emails): string
    {
        foreach ($emails ?? [] as $email) {
            if (is_string($email) && trim($email) !== '') {
                return trim($email);
            }
        }

        return '';
    }
}
