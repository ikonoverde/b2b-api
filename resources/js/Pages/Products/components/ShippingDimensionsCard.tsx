import type { ProductFormData } from '../types';

const fields = [
    [
        { key: 'weight_kg' as const, label: 'Peso', unit: 'kg' },
        { key: 'width_cm' as const, label: 'Ancho', unit: 'cm' },
    ],
    [
        { key: 'height_cm' as const, label: 'Alto', unit: 'cm' },
        { key: 'depth_cm' as const, label: 'Profundidad', unit: 'cm' },
    ],
];

export default function ShippingDimensionsCard({
    data,
    setData,
    errors,
}: {
    data: ProductFormData;
    setData: (key: keyof ProductFormData, value: string) => void;
    errors: Partial<Record<string, string>>;
}) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Peso y Dimensiones
                </h2>
                <p className="text-xs text-[#999999] font-[Outfit] mt-1">
                    Requerido para cotizaciones de envío
                </p>
            </div>
            <div className="p-6 flex flex-col gap-5">
                {fields.map((row, i) => (
                    <div key={i} className="flex gap-5">
                        {row.map(({ key, label, unit }) => (
                            <div key={key} className="flex-1 flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    {label}
                                </label>
                                <div className="flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                                    <input
                                        type="text"
                                        value={data[key]}
                                        onChange={(e) => setData(key, e.target.value)}
                                        placeholder="0.00"
                                        className="flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                                    />
                                    <span className="flex items-center px-3 bg-[#F5F3F0] border-l border-[#E5E5E5] text-sm text-[#666666] font-[Outfit]">
                                        {unit}
                                    </span>
                                </div>
                                {errors[key] && (
                                    <span className="text-xs text-red-500 font-[Outfit]">{errors[key]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
