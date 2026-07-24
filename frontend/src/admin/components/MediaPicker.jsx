import { useCallback, useRef, useState } from "react";
import { FiImage, FiUpload } from "react-icons/fi";

import { ApiError } from "../../shared/api/client";
import { listMedia, uploadMedia } from "../api/mediaApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { useToast } from "../toast/useToast";
import { Drawer } from "./Drawer";
import { SearchInput } from "./SearchInput";
import { Skeleton } from "./Skeleton";

// Document 6 Media Picker: select-existing (grid, searchable) or
// upload-new, in one component every content form can drop in wherever it
// needs an image (Team, Testimonials, Awards, Certifications, Services,
// Blog). Value/onChange shape: { mediaId, url } | null.
export function MediaPicker({ label, value, onChange }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetcher = useCallback(() => listMedia({ page: 1, pageSize: 60, q }), [q]);
  const { data, loading, refetch } = useAsyncData(fetcher);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const media = await uploadMedia(file);
      showToast("Image uploaded.");
      onChange({ mediaId: media.id, url: media.path });
      setOpen(false);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label ? <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary/70">{label}</p> : null}
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-secondary/15 bg-secondary/5">
          {value?.url ? (
            <img src={value.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <FiImage className="h-6 w-6 text-secondary/30" aria-hidden="true" />
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-secondary/15 px-3 py-1.5 text-sm font-medium text-secondary hover:bg-secondary/5"
          >
            Choose
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-secondary/15 px-3 py-1.5 text-sm font-medium text-secondary/60 hover:bg-secondary/5"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <Drawer open={open} title="Choose Image" onClose={() => setOpen(false)}>
        <div className="mb-3 flex items-center gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Search media..." />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-secondary/15 px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/5 disabled:opacity-60"
          >
            <FiUpload className="h-4 w-4" /> Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-secondary/50">No media found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange({ mediaId: item.id, url: item.path });
                  setOpen(false);
                }}
                className="relative aspect-square overflow-hidden rounded-lg border border-secondary/10 hover:ring-2 hover:ring-brand-600"
              >
                <img src={item.path} alt={item.altText || ""} className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
