<?php

namespace Database\Factories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => Report::TYPE_KEYWORD_RESEARCH,
            'agent' => 'keywords_specialist',
            'title' => 'Investigación de keywords: aceites de masaje profesional',
            'summary' => 'Clúster transaccional para compradores profesionales, con oportunidades de contenido informativo de apoyo.',
            'body' => "## Clúster principal\n\n- aceite de masaje profesional — ESTIMATED, intención transaccional.\n\n## Oportunidades\n\nContenido de apoyo sobre técnicas y estándares profesionales.",
        ];
    }
}
