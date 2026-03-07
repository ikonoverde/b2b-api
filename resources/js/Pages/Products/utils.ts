export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_IMAGES = 4;

export function processImageFiles(
    files: File[],
    remainingSlots: number,
    onValidFile: (file: File) => void,
    onPreviewReady: (preview: string) => void,
): void {
    const filesToAdd = files.slice(0, remainingSlots);

    for (const file of filesToAdd) {
        if (file.size > MAX_FILE_SIZE) {
            alert('El archivo debe ser menor a 5MB');
            continue;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            alert('Solo se permiten archivos PNG, JPG o WEBP');
            continue;
        }

        onValidFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            onPreviewReady(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
}

export function removeAtIndex<T>(arr: T[], index: number): T[] {
    return arr.filter((_, i) => i !== index);
}
