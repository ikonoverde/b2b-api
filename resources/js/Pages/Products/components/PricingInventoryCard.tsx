import type { ProductFormData } from '../types';

export default function PricingInventoryCard({
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
                    Precios e Inventario
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
                <div className="flex gap-5">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            Precio de Venta
                        </label>
                        <div className="flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                            <div className="flex items-center px-3 bg-[#F5F3F0] border-r border-[#E5E5E5]">
                                <span className="text-sm text-[#666666] font-[Outfit]">$</span>
                            </div>
                            <input
                                type="text"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                                className="flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                            />
                        </div>
                        {errors.price && (
                            <span className="text-xs text-red-500 font-[Outfit]">{errors.price}</span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            Precio de Costo
                        </label>
                        <div className="flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                            <div className="flex items-center px-3 bg-[#F5F3F0] border-r border-[#E5E5E5]">
                                <span className="text-sm text-[#666666] font-[Outfit]">$</span>
                            </div>
                            <input
                                type="text"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                placeholder="0.00"
                                className="flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                            />
                        </div>
                        {errors.cost && (
                            <span className="text-xs text-red-500 font-[Outfit]">{errors.cost}</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-5">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            Stock Disponible
                        </label>
                        <input
                            type="text"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="0"
                            className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                        />
                        {errors.stock && (
                            <span className="text-xs text-red-500 font-[Outfit]">{errors.stock}</span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            Stock M&iacute;nimo
                        </label>
                        <input
                            type="text"
                            value={data.min_stock}
                            onChange={(e) => setData('min_stock', e.target.value)}
                            placeholder="0"
                            className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                        />
                        {errors.min_stock && (
                            <span className="text-xs text-red-500 font-[Outfit]">{errors.min_stock}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
