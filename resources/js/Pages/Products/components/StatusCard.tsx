import ToggleSwitch from './ToggleSwitch';

export default function StatusCard({
    isActive,
    isFeatured,
    onToggleActive,
    onToggleFeatured,
}: {
    isActive: boolean;
    isFeatured: boolean;
    onToggleActive: () => void;
    onToggleFeatured: () => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Estado del Producto
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
                <ToggleSwitch
                    enabled={isActive}
                    onToggle={onToggleActive}
                    label="Producto Activo"
                    description="Visible en el cat&aacute;logo"
                />
                <ToggleSwitch
                    enabled={isFeatured}
                    onToggle={onToggleFeatured}
                    label="Producto Destacado"
                    description="Mostrar en p&aacute;gina principal"
                />
            </div>
        </div>
    );
}
