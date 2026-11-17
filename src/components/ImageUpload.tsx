"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { isImgbbConfigured, uploadImageToImgbb } from "@/lib/imgbb";

/**
 * Image picker with two paths:
 *  - When an ImgBB key is configured: direct file upload to ImgBB.
 *  - When it is not: a plain image-URL text input, so posting tuitions
 *    and updating profiles still work without any key.
 */
export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgbb = isImgbbConfigured();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageToImgbb(file);
      onChange(url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
        {label}
      </label>

      {value && (
        <div className="mb-3 overflow-hidden rounded-2xl border border-brand-100 dark:border-brand-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-44 w-full object-cover" />
        </div>
      )}

      {imgbb ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : value ? "Change Image" : "Upload Image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900"
          />
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/banner.jpg"
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900"
        />
      )}

      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        {hint ??
          (imgbb
            ? "Upload a JPG/PNG image, or paste an image URL instead."
            : "Direct upload is not configured yet — paste an image URL (e.g. from ImgBB or Unsplash).")}
      </p>
    </div>
  );
}
