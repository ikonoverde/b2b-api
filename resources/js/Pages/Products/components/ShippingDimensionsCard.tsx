import type { ProductFormData, ShippingPackageFormData } from '../types';

type ShippingDimensionsCardProps = {
    data: ProductFormData;
    setData: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
    errors: Partial<Record<string, string>>;
};

type PackageInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    unit: string;
    error?: string;
    inputMode?: 'decimal' | 'numeric';
};

const baseDimensionFields = [
    { key: 'weight_kg' as const, label: 'Peso base', unit: 'kg' },
    { key: 'width_cm' as const, label: 'Ancho base', unit: 'cm' },
    { key: 'height_cm' as const, label: 'Alto base', unit: 'cm' },
    { key: 'depth_cm' as const, label: 'Profundidad base', unit: 'cm' },
];

const packageFields = [
    { key: 'weight_kg' as const, label: 'Peso', unit: 'kg', placeholder: '5.10' },
    { key: 'width_cm' as const, label: 'Ancho', unit: 'cm', placeholder: '20' },
    { key: 'height_cm' as const, label: 'Alto', unit: 'cm', placeholder: '17' },
    { key: 'depth_cm' as const, label: 'Prof.', unit: 'cm', placeholder: '25' },
];

const emptyShippingPackage: ShippingPackageFormData = {
    quantity: '',
    weight_kg: '',
    width_cm: '',
    height_cm: '',
    depth_cm: '',
};

export default function ShippingDimensionsCard({ data, setData, errors }: ShippingDimensionsCardProps) {
    const updatePackage = <K extends keyof ShippingPackageFormData>(
        index: number,
        key: K,
        value: ShippingPackageFormData[K],
    ) => {
        setData(
            'shipping_packages',
            data.shipping_packages.map((pkg, i) => (i === index ? { ...pkg, [key]: value } : pkg)),
        );
    };

    const addPackage = () => {
        setData('shipping_packages', [...data.shipping_packages, { ...emptyShippingPackage }]);
    };

    const removePackage = (index: number) => {
        setData('shipping_packages', data.shipping_packages.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Peso y Dimensiones
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Define el empaque base y medidas específicas por cantidad para cotizar envíos.
                </p>
            </div>
            <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            Empaque base
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Se usa como respaldo cuando no hay una configuración exacta para la cantidad.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {baseDimensionFields.map(({ key, label, unit }) => (
                            <div key={key} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-foreground">
                                    {label}
                                </label>
                                <div className="flex h-11 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={data[key]}
                                        onChange={(e) => setData(key, e.target.value)}
                                        placeholder="0.00"
                                        className="flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                                    />
                                    <span className="flex items-center px-3 bg-muted border-l border-border text-sm text-muted-foreground">
                                        {unit}
                                    </span>
                                </div>
                                {errors[key] && (
                                    <span className="text-xs text-destructive">{errors[key]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border pt-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Empaques por cantidad
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ejemplo: 2 piezas pueden pesar 10.11 kg y medir 35 × 17 × 25 cm.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={addPackage}
                            className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary transition-colors"
                        >
                            Agregar fila
                        </button>
                    </div>

                    {data.shipping_packages.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-background px-4 py-5 text-sm text-muted-foreground">
                            No hay empaques por cantidad. Agrega las filas necesarias para productos que cambian su peso o volumen al agruparse.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="min-w-[720px] flex flex-col gap-3">
                                <div className="grid grid-cols-[120px_repeat(4,minmax(110px,1fr))_40px] gap-3 px-1 text-xs font-semibold text-muted-foreground">
                                    <span>Cantidad</span>
                                    {packageFields.map((field) => (
                                        <span key={field.key}>{field.label}</span>
                                    ))}
                                    <span />
                                </div>

                                {data.shipping_packages.map((pkg, index) => (
                                    <div key={index} className="grid grid-cols-[120px_repeat(4,minmax(110px,1fr))_40px] gap-3 items-start">
                                        <PackageInput
                                            value={pkg.quantity}
                                            onChange={(value) => updatePackage(index, 'quantity', value)}
                                            placeholder="1"
                                            unit="uds"
                                            error={errors[`shipping_packages.${index}.quantity`]}
                                            inputMode="numeric"
                                        />
                                        {packageFields.map((field) => (
                                            <PackageInput
                                                key={field.key}
                                                value={pkg[field.key]}
                                                onChange={(value) => updatePackage(index, field.key, value)}
                                                placeholder={field.placeholder}
                                                unit={field.unit}
                                                error={errors[`shipping_packages.${index}.${field.key}`]}
                                            />
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => removePackage(index)}
                                            className="h-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            aria-label="Eliminar fila de empaque"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {errors.shipping_packages && (
                        <span className="text-xs text-destructive">{errors.shipping_packages}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function PackageInput({
    value,
    onChange,
    placeholder,
    unit,
    error,
    inputMode = 'decimal',
}: PackageInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex h-10 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors">
                <input
                    type="text"
                    inputMode={inputMode}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                />
                <span className="flex items-center px-2 bg-muted border-l border-border text-xs text-muted-foreground">
                    {unit}
                </span>
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
    );
}
