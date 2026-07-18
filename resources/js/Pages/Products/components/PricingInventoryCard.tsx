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
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Precios e Inventario
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
                <div className="flex gap-5">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Precio de Venta
                        </label>
                        <div className="flex h-11 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors">
                            <div className="flex items-center px-3 bg-muted border-r border-border">
                                <span className="text-sm text-muted-foreground">$</span>
                            </div>
                            <input
                                type="text"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                                className="flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                            />
                        </div>
                        {errors.price && (
                            <span className="text-xs text-destructive">{errors.price}</span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Precio de Costo
                        </label>
                        <div className="flex h-11 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors">
                            <div className="flex items-center px-3 bg-muted border-r border-border">
                                <span className="text-sm text-muted-foreground">$</span>
                            </div>
                            <input
                                type="text"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                placeholder="0.00"
                                className="flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                            />
                        </div>
                        {errors.cost && (
                            <span className="text-xs text-destructive">{errors.cost}</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-5">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Stock Disponible
                        </label>
                        <input
                            type="text"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="0"
                            className="h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                        />
                        {errors.stock && (
                            <span className="text-xs text-destructive">{errors.stock}</span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Stock M&iacute;nimo
                        </label>
                        <input
                            type="text"
                            value={data.min_stock}
                            onChange={(e) => setData('min_stock', e.target.value)}
                            placeholder="0"
                            className="h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                        />
                        {errors.min_stock && (
                            <span className="text-xs text-destructive">{errors.min_stock}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
