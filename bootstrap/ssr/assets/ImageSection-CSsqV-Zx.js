import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 4;
function processImageFiles(files, remainingSlots, onValidFile, onPreviewReady) {
  const filesToAdd = files.slice(0, remainingSlots);
  for (const file of filesToAdd) {
    if (file.size > MAX_FILE_SIZE) {
      alert("El archivo debe ser menor a 5MB");
      continue;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Solo se permiten archivos PNG, JPG o WEBP");
      continue;
    }
    onValidFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      onPreviewReady(e.target?.result);
    };
    reader.readAsDataURL(file);
  }
}
function removeAtIndex(arr, index) {
  return arr.filter((_, i) => i !== index);
}
function ImagePreview({
  src,
  alt,
  onRemove
}) {
  return /* @__PURE__ */ jsxs("div", { className: "relative h-[120px] bg-[#FBF9F7] rounded-xl border-2 border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt,
        className: "w-full h-full object-cover"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onRemove,
        className: "absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors",
        children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3 text-[#666666]" })
      }
    )
  ] });
}
function ImageDropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      onDragOver,
      onDragLeave,
      onDrop,
      className: `flex flex-col items-center justify-center gap-2 h-[120px] w-full bg-[#FBF9F7] rounded-xl border-2 border-dashed ${isDragging ? "border-[#4A5D4A] bg-[#E8EDE8]" : "border-[#E5E5E5]"} hover:border-[#4A5D4A] transition-colors`,
      children: [
        /* @__PURE__ */ jsx(ImagePlus, { className: "w-6 h-6 text-[#4A5D4A]" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Agregar" })
      ]
    }
  );
}
function ImageSection({
  images,
  onImagesChange,
  existingImages,
  onExistingImageRemove
}) {
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const existingCount = existingImages?.length ?? 0;
  const totalImages = existingCount + newImagePreviews.length;
  const canAddMore = totalImages < MAX_IMAGES;
  const addFiles = (files) => {
    processImageFiles(
      files,
      MAX_IMAGES - totalImages,
      (file) => onImagesChange([...images, file]),
      (preview) => setNewImagePreviews((prev) => [...prev, preview])
    );
  };
  const removeNewImage = (index) => {
    setNewImagePreviews(removeAtIndex(newImagePreviews, index));
    onImagesChange(removeAtIndex(images, index));
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Imágenes del Producto" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: "image/png,image/jpeg,image/webp",
          onChange: (e) => {
            if (e.target.files) {
              addFiles(Array.from(e.target.files));
              e.target.value = "";
            }
          },
          multiple: true,
          className: "hidden"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        existingImages?.map((img) => /* @__PURE__ */ jsx(
          ImagePreview,
          {
            src: img.image_url,
            alt: "Product image",
            onRemove: () => onExistingImageRemove?.(img.id)
          },
          img.id
        )),
        newImagePreviews.map((preview, index) => /* @__PURE__ */ jsx(
          ImagePreview,
          {
            src: preview,
            alt: "New product image",
            onRemove: () => removeNewImage(index)
          },
          `new-${index}`
        )),
        canAddMore && /* @__PURE__ */ jsx(
          ImageDropZone,
          {
            isDragging,
            onDragOver: (e) => {
              e.preventDefault();
              setIsDragging(true);
            },
            onDragLeave: (e) => {
              e.preventDefault();
              setIsDragging(false);
            },
            onDrop: (e) => {
              e.preventDefault();
              setIsDragging(false);
              addFiles(Array.from(e.dataTransfer.files));
            },
            onClick: () => fileInputRef.current?.click()
          }
        )
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "PNG, JPG o WEBP. Máximo 5MB por imagen. Hasta 4 imágenes." })
    ] })
  ] });
}
export {
  ImageSection as default
};
