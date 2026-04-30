import { Leaf } from 'lucide-react';

export function AuthMobileHeader() {
    return (
        <div className="lg:hidden bg-[#5E7052] px-6 py-4">
            <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                    <span className="text-white font-[Outfit] font-bold text-lg tracking-wider">
                        Ikonoverde
                    </span>
                    <span className="text-[#A8B5A0] font-[Outfit] text-[10px] tracking-widest uppercase">
                        PROFESIONAL
                    </span>
                </div>
            </div>
        </div>
    );
}

export function AuthDesktopBrandPanel() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-[#5E7052] flex-col items-center justify-center p-16 relative overflow-hidden">
            <div className="absolute top-12 left-12 opacity-10">
                <Leaf className="w-32 h-32 text-white rotate-[-30deg]" />
            </div>
            <div className="absolute bottom-16 right-16 opacity-10">
                <Leaf className="w-24 h-24 text-white rotate-[45deg]" />
            </div>

            <div className="flex flex-col items-center gap-6 max-w-[400px] relative z-10">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[36px] font-bold text-white font-[Outfit] tracking-wider">
                        Ikonoverde
                    </span>
                    <span className="text-[#A8B5A0] font-[Outfit] text-sm tracking-[0.25em] uppercase">
                        PROFESIONAL
                    </span>
                </div>
                <div className="w-16 h-px bg-white/20"></div>
                <p className="text-lg text-[#A8B5A0] text-center leading-relaxed font-[Outfit]">
                    Portal B2B para Profesionales
                </p>
            </div>
        </div>
    );
}
