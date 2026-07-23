import { useCallback, useRef, useState } from "react";
import { FiImage, FiTrash2, FiUpload } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { deleteMedia, listMedia, updateMedia, uploadMedia } from "../../api/mediaApi";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Drawer } from "../../components/Drawer";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { Pagination } from "../../components/Pagination";
import { PageHeader } from "../../components/PageHeader";
import { SearchInput } from "../../components/SearchInput";
import { Skeleton } from "../../components/Skeleton";
import { TextField } from "../../components/form/Field";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { useToast } from "../../toast/useToast";

export default function MediaLibrary() {
  useBreadcrumb([{ label: "Media Library" }]);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [altDraft, setAltDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetcher = useCallback(() => listMedia({ page, pageSize: 24, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      await uploadMedia(file);
      showToast("Image uploaded.");
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const openItem = (item) => {
    setSelected(item);
    setAltDraft(item.altText || "");
    setDeleteError(null);
  };

  const saveAltText = async () => {
    setSaving(true);
    try {
      await updateMedia(selected.id, altDraft);
      showToast("Alt text updated.");
      setSelected(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteMedia(selected.id);
      showToast("Image deleted.");
      setConfirmDelete(false);
      setSelected(null);
      refetch();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not delete.";
      setDeleteError(message);
      setConfirmDelete(false);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <ErrorState message="Could not load the media library." onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Images used across team, testimonials, awards, services, and blog."
        action={
          <Button onClick={handleUploadClick} loading={uploading}>
            <FiUpload className="h-4 w-4" /> Upload Image
          </Button>
        }
      />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by filename or alt text..." />
      </div>

      <div className="rounded-xl border border-secondary/10 bg-white p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={FiImage}
            title="No media yet"
            description="Upload your first image to reuse it across team, testimonials, and blog content."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-secondary/10 bg-secondary/5"
              >
                <img src={item.path} alt={item.altText || ""} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-secondary/70 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.originalFilename}
                </span>
              </button>
            ))}
          </div>
        )}
        {!loading && data.items.length > 0 ? (
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
        ) : null}
      </div>

      <Drawer open={Boolean(selected)} title="Image Details" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            <img src={selected.path} alt={selected.altText || ""} className="w-full rounded-lg border border-secondary/10" />
            <TextField
              id="altText"
              label="Alt Text"
              value={altDraft}
              onChange={(e) => setAltDraft(e.target.value)}
              placeholder="Describe this image for accessibility"
            />
            <dl className="grid grid-cols-2 gap-2 text-xs text-secondary/60">
              <div>
                <dt className="font-semibold text-secondary/40">Type</dt>
                <dd>{selected.mimeType}</dd>
              </div>
              <div>
                <dt className="font-semibold text-secondary/40">Size</dt>
                <dd>{(selected.sizeBytes / 1024).toFixed(1)} KB</dd>
              </div>
            </dl>
            {deleteError ? <p role="alert" className="text-sm text-red-600">{deleteError}</p> : null}
            <div className="flex justify-between gap-2 border-t border-secondary/10 pt-4">
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <FiTrash2 className="h-4 w-4" /> Delete
              </Button>
              <Button onClick={saveAltText} loading={saving}>
                Save
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this image?"
        description="This cannot be undone. If it's still used elsewhere, deletion will be blocked."
        confirmLabel="Delete"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
