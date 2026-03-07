import { useState, useRef, DragEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { processImageFiles, removeAtIndex, MAX_IMAGES } from '../utils';
import type { ExistingImage } from '../types';

function ImagePreview({
    src,
    alt,
    onRemove,
}: {
    src: string;
    alt: string;
    onRemove: () => void;
}) {
    return (
        <div className="relative h-[120px] bg-[#FBF9F7] rounded-xl border-2 border-[#E5E5E5] overflow-hidden">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
                <X className="w-3 h-3 text-[#666666]" />
            </button>
        </div>
    );
}

function ImageDropZone({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
}: {
    isDragging: boolean;
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDragLeave: (e: DragEvent<HTMLElement>) => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 h-[120px] w-full bg-[#FBF9F7] rounded-xl border-2 border-dashed ${
                isDragging ? 'border-[#4A5D4A] bg-[#E8EDE8]' : 'border-[#E5E5E5]'
            } hover:border-[#4A5D4A] transition-colors`}
        >
            <ImagePlus className="w-6 h-6 text-[#4A5D4A]" />
            <span className="text-xs text-[#999999] font-[Outfit]">
                Agregar
            </span>
        </button>
    );
}

export default function ImageSection({
    images,
    onImagesChange,
    existingImages,
    onExistingImageRemove,
}: {
    images: File[];
    onImagesChange: (images: File[]) => void;
    existingImages?: ExistingImage[];
    onExistingImageRemove?: (id: number) => void;
}) {
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const existingCount = existingImages?.length ?? 0;
    const totalImages = existingCount + newImagePreviews.length;
    const canAddMore = totalImages < MAX_IMAGES;

    const addFiles = (files: File[]) => {
        processImageFiles(
            files,
            MAX_IMAGES - totalImages,
            (file) => onImagesChange([...images, file]),
            (preview) => setNewImagePreviews((prev) => [...prev, preview]),
        );
    };

    const removeNewImage = (index: number) => {
        setNewImagePreviews(removeAtIndex(newImagePreviews, index));
        onImagesChange(removeAtIndex(images, index));
    };

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Im&aacute;genes del Producto
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => { if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ''; } }}
                    multiple
                    className="hidden"
                />
                <div className="grid grid-cols-2 gap-3">
                    {existingImages?.map((img) => (
                        <ImagePreview
                            key={img.id}
                            src={img.image_url}
                            alt="Product image"
                            onRemove={() => onExistingImageRemove?.(img.id)}
                        />
                    ))}
                    {newImagePreviews.map((preview, index) => (
                        <ImagePreview
                            key={`new-${index}`}
                            src={preview}
                            alt="New product image"
                            onRemove={() => removeNewImage(index)}
                        />
                    ))}
                    {canAddMore && (
                        <ImageDropZone
                            isDragging={isDragging}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
                            onClick={() => fileInputRef.current?.click()}
                        />
                    )}
                </div>
                <span className="text-xs text-[#999999] font-[Outfit]">
                    PNG, JPG o WEBP. M&aacute;ximo 5MB por imagen. Hasta 4 im&aacute;genes.
                </span>
            </div>
        </div>
    );
}
