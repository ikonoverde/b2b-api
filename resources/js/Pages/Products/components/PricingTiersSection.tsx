import { Plus, Trash2 } from 'lucide-react';
import type { PricingTier } from '../types';

function PricingTierRow({
    tier,
    index,
    errors,
    onUpdate,
    onRemove,
}: {
    tier: PricingTier;
    index: number;
    errors: Partial<Record<string, string>>;
    onUpdate: (index: number, field: keyof PricingTier, value: string) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className="p-4 bg-[#FBF9F7] rounded-xl border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    Nivel {index + 1}
                </span>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                        Cant. M&iacute;nima
                    </label>
                    <input
                        type="text"
                        value={tier.min_qty}
                        onChange={(e) => onUpdate(index, 'min_qty', e.target.value)}
                        placeholder="1"
                        className="h-9 px-3 bg-white rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                    />
                    {errors[`pricing_tiers.${index}.min_qty`] && (
                        <span className="text-xs text-red-500 font-[Outfit]">
                            {errors[`pricing_tiers.${index}.min_qty`]}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                        Cant. M&aacute;xima
                    </label>
                    <input
                        type="text"
                        value={tier.max_qty}
                        onChange={(e) => onUpdate(index, 'max_qty', e.target.value)}
                        placeholder="Sin l&iacute;mite"
                        className="h-9 px-3 bg-white rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                    />
                    {errors[`pricing_tiers.${index}.max_qty`] && (
                        <span className="text-xs text-red-500 font-[Outfit]">
                            {errors[`pricing_tiers.${index}.max_qty`]}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                        Precio
                    </label>
                    <div className="flex h-9 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                        <div className="flex items-center px-2 bg-[#F5F3F0] border-r border-[#E5E5E5]">
                            <span className="text-xs text-[#666666] font-[Outfit]">$</span>
                        </div>
                        <input
                            type="text"
                            value={tier.price}
                            onChange={(e) => onUpdate(index, 'price', e.target.value)}
                            placeholder="0.00"
                            className="flex-1 px-2 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                        />
                    </div>
                    {errors[`pricing_tiers.${index}.price`] && (
                        <span className="text-xs text-red-500 font-[Outfit]">
                            {errors[`pricing_tiers.${index}.price`]}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                        Descuento
                    </label>
                    <div className="flex h-9 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                        <input
                            type="text"
                            value={tier.discount}
                            onChange={(e) => onUpdate(index, 'discount', e.target.value)}
                            placeholder="0"
                            className="flex-1 px-2 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                        />
                        <div className="flex items-center px-2 bg-[#F5F3F0] border-l border-[#E5E5E5]">
                            <span className="text-xs text-[#666666] font-[Outfit]">%</span>
                        </div>
                    </div>
                    {errors[`pricing_tiers.${index}.discount`] && (
                        <span className="text-xs text-red-500 font-[Outfit]">
                            {errors[`pricing_tiers.${index}.discount`]}
                        </span>
                    )}
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                        Etiqueta
                    </label>
                    <input
                        type="text"
                        value={tier.label}
                        onChange={(e) => onUpdate(index, 'label', e.target.value)}
                        placeholder="Ej: Mayorista, Distribuidor"
                        className="h-9 px-3 bg-white rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                    />
                    {errors[`pricing_tiers.${index}.label`] && (
                        <span className="text-xs text-red-500 font-[Outfit]">
                            {errors[`pricing_tiers.${index}.label`]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PricingTiersSection({
    tiers,
    errors,
    onTiersChange,
}: {
    tiers: PricingTier[];
    errors: Partial<Record<string, string>>;
    onTiersChange: (tiers: PricingTier[]) => void;
}) {
    const addPricingTier = () => {
        const lastTier = tiers[tiers.length - 1];
        const suggestedMinQty = lastTier && lastTier.max_qty ? String(parseInt(lastTier.max_qty) + 1) : '1';

        onTiersChange([
            ...tiers,
            {
                min_qty: suggestedMinQty,
                max_qty: '',
                price: '',
                discount: '',
                label: '',
            },
        ]);
    };

    const removePricingTier = (index: number) => {
        onTiersChange(tiers.filter((_, i) => i !== index));
    };

    const updatePricingTier = (index: number, field: keyof PricingTier, value: string) => {
        const updatedTiers = [...tiers];
        updatedTiers[index] = { ...updatedTiers[index], [field]: value };
        onTiersChange(updatedTiers);
    };

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Niveles de Precios
                </h2>
                <button
                    type="button"
                    onClick={addPricingTier}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8EDE8] rounded-lg text-sm font-medium text-[#4A5D4A] font-[Outfit] hover:bg-[#d9e2d9] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Agregar
                </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
                {errors.pricing_tiers && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="text-xs text-red-600 font-[Outfit]">{errors.pricing_tiers}</span>
                    </div>
                )}

                {tiers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <span className="text-sm text-[#999999] font-[Outfit]">
                            No hay niveles de precios configurados.
                        </span>
                        <span className="text-xs text-[#BBBBBB] font-[Outfit] mt-1">
                            Los niveles permiten ofrecer descuentos por volumen.
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {tiers.map((tier, index) => (
                            <PricingTierRow
                                key={index}
                                tier={tier}
                                index={index}
                                errors={errors}
                                onUpdate={updatePricingTier}
                                onRemove={removePricingTier}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
