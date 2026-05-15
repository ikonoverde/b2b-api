<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = Category::firstOrCreate(
            ['slug' => 'cuidado-corporal'],
            ['name' => 'Cuidado Corporal', 'is_active' => true],
        );

        foreach ($this->products() as $product) {
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                [
                    'name' => $product['name'],
                    'slug' => Str::slug($product['name']),
                    'category_id' => $category->id,
                    'description' => $product['description'],
                    'active_ingredients' => $product['active_ingredients'],
                    'recommendations' => $product['recommendations'],
                    'price' => $product['price'],
                    'stock' => 100,
                    'is_active' => true,
                ],
            );
        }
    }

    /**
     * Catalog products sourced from the pro-products list.
     *
     * @return list<array{sku: string, name: string, price: float, description: string, active_ingredients: string, recommendations: string}>
     */
    private function products(): array
    {
        $relaxingOil = [
            'description' => 'La fórmula de este aceite proporciona tranquilidad y bienestar emocional, es ideal para masajes suaves al final del día o en momentos de relax, por su origen natural se absorbe muy bien sobre la piel y deja una sensación de suavidad al tacto.',
            'active_ingredients' => 'El aceite de almendras hidrata en profundidad, los extractos de hibisco y caléndula ayudan a nutrir, calmar irritaciones y dejar una sensación de seda sobre la piel. La lavanda y el geranio promueven un equilibrio de emociones, reducen la ansiedad e inducen el sueño.',
            'recommendations' => 'Apto para todo tipo de piel.',
        ];

        $deepOil = [
            'description' => 'Está formulado para el trabajo terapéutico y la recuperación muscular. Sus ingredientes son conocidos por sus propiedades estimulantes, analgésicas y antiinflamatorias. Es ideal para masajes deportivos, nudos musculares o zonas con dolor crónico.',
            'active_ingredients' => 'Los aceites vegetales base, permiten trabajar profundamente, la presencia de romero mejora la circulación sanguínea local, el árnica reduce inflamación y acelera la recuperación, el axocopaque es un potente analgésico natural, la canela aporta calor profundo y el mentol produce un efecto frío-calor reduciendo la percepción de dolor.',
            'recommendations' => 'Ideal para deportistas, contracturas y dolores posturales. No se recomienda en embarazo o pieles sensibles.',
        ];

        return [
            [
                'sku' => 'PRO-1-5L',
                'name' => 'Aceite para Masaje Relajante - Garrafa 5 L',
                'price' => 2947.56,
                ...$relaxingOil,
            ],
            [
                'sku' => 'PRO-1-1L',
                'name' => 'Aceite para Masaje Relajante - Botella 1 L',
                'price' => 788.80,
                ...$relaxingOil,
            ],
            [
                'sku' => 'PRO-2-5L',
                'name' => 'Aceite para Masaje Profundo - Garrafa 5 L',
                'price' => 4066.97,
                ...$deepOil,
            ],
            [
                'sku' => 'PRO-2-1L',
                'name' => 'Aceite para Masaje Profundo - Botella 1 L',
                'price' => 1038.20,
                ...$deepOil,
            ],
            [
                'sku' => 'PRO-3-1L',
                'name' => 'Mantequilla Corporal - Bote 1 L',
                'price' => 617.12,
                'description' => 'Es ideal para pieles secas, sensibles o deshidratadas, aportando nutrición intensa sin resultar pesada, perfecta para usar después de la ducha o después de un tratamiento exfoliante en manos, pies y codos o como ritual nocturno en todo el cuerpo.',
                'active_ingredients' => 'La manteca de karité ofrece hidratación profunda y duradera, los aceites vegetales de coco no comedogénicos, son suaves con la piel aportan suavidad y tienen acción antimicrobiana y antifúngica, la lavanda y la vitamina E aportan calma y regeneración a pieles sensibles o con picor y nutren profundamente.',
                'recommendations' => 'Apto para todo tipo de piel, recomendado para zonas secas como pies, codos y rodillas.',
            ],
            [
                'sku' => 'PRO-4-1L',
                'name' => 'Exfoliante Corporal - Bote 1 L',
                'price' => 696.00,
                'description' => 'Fórmula ideal para aplicar en todo el cuerpo, limpia a profundidad, retirando células muertas y remineralizando la piel con una fácil aplicación por su presentación en gel fácil de manejar dejando lista la piel para tratamientos nutritivos e hidratantes.',
                'active_ingredients' => 'La manteca de Karité y el extracto oleoso de caléndula nutren y regeneran la barrera cutánea, la manteca de cacao aporta hidratación prolongada, los cristales de azúcar y el caolín exfolian de forma física y moderada, ofrecen una piel lisa y renovada. Los aceites esenciales de Ylang Ylang y Bergamota dan un agradable aroma.',
                'recommendations' => 'Apto para todo tipo de piel. Excelente en tratamientos durante el embarazo.',
            ],
            [
                'sku' => 'PRO-5-5L',
                'name' => 'Gel After Sun - Garrafa 5 L',
                'price' => 1898.92,
                'description' => 'Ideal para aplicar después de exposición al sol o tratamientos que puedan irritar la piel como depilación o aparatología, ya que calma el enrojecimiento repara la barrera dañada y previene la descamación excesiva.',
                'active_ingredients' => 'El aloe vera calma al instante la sensación de quemazón y enrojecimiento hidrata profundamente y ofrece acción antiinflamatoria natural. El extracto de menta aporta sensación de frescor prolongado sin resecar y la manzanilla tiene alto poder antiinflamatorio y calmante que suaviza irritaciones y picores.',
                'recommendations' => 'Apto para todo tipo de piel.',
            ],
        ];
    }
}
