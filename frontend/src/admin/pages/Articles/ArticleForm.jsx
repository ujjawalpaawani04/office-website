import { useRef, useState } from "react";
import { FiFilm, FiImage, FiUploadCloud } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { articlesApi } from "../../api/articlesApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { SelectField, TextAreaField, TextField } from "../../components/form/Field";
import { useToast } from "../../toast/useToast";

const MAX_THUMBNAIL_MB = 5;
const MAX_VIDEO_MB = 100;

function formFromInitial(initial) {
  if (!initial) return { title: "", shortDescription: "", designation: "", batch: "", status: "draft", displayOrder: 0 };
  return {
    title: initial.title || "",
    shortDescription: initial.shortDescription || "",
    designation: initial.designation || "",
    batch: initial.batch || "",
    status: initial.status || "draft",
    displayOrder: initial.displayOrder ?? 0,
  };
}

export function ArticleForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initial?.thumbnail || null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnail: "Please choose an image file." }));
      return;
    }
    if (file.size > MAX_THUMBNAIL_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: `Thumbnail must be under ${MAX_THUMBNAIL_MB}MB.` }));
      return;
    }
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "video/mp4" && !file.name.toLowerCase().endsWith(".mp4")) {
      setErrors((prev) => ({ ...prev, video: "Please choose an MP4 file." }));
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, video: `Video must be under ${MAX_VIDEO_MB}MB.` }));
      return;
    }
    setErrors((prev) => ({ ...prev, video: undefined }));
    setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form, thumbnailFile, videoFile };
      if (initial) {
        await articlesApi.update(initial.id, payload);
        showToast("Article updated.");
      } else {
        if (!thumbnailFile || !videoFile) {
          setErrors({
            ...(thumbnailFile ? {} : { thumbnail: "Please choose a thumbnail image to upload." }),
            ...(videoFile ? {} : { video: "Please choose an MP4 video to upload." }),
          });
          setSaving(false);
          return;
        }
        await articlesApi.create(payload);
        showToast("Article created.");
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.body?.fields || {});
      else showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} title={initial ? "Edit Article" : "Add Article"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="art-title"
          label="Article Title"
          required
          value={form.title}
          error={errors.title}
          onChange={(e) => setField("title", e.target.value)}
        />
        <TextAreaField
          id="art-desc"
          label="Short Description"
          value={form.shortDescription}
          error={errors.shortDescription}
          onChange={(e) => setField("shortDescription", e.target.value)}
        />
        <TextField
          id="art-designation"
          label="Designation"
          placeholder="e.g. Article Assistant"
          value={form.designation}
          error={errors.designation}
          onChange={(e) => setField("designation", e.target.value)}
        />
        <TextField
          id="art-batch"
          label="Batch"
          placeholder="e.g. 2024-26"
          value={form.batch}
          error={errors.batch}
          onChange={(e) => setField("batch", e.target.value)}
        />

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
            Thumbnail {!initial ? <span className="text-red-500">*</span> : null}
          </span>
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-lg border border-dashed border-secondary/20 p-3 text-left hover:border-brand-700/40 hover:bg-brand-50/40"
          >
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary/5 text-secondary/40">
                <FiImage className="h-6 w-6" aria-hidden="true" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                <FiUploadCloud className="h-4 w-4" aria-hidden="true" />
                {thumbnailFile ? "Change image" : initial ? "Replace image" : "Upload image"}
              </span>
              <span className="block truncate text-xs text-secondary/50">
                {thumbnailFile?.name || "JPG, PNG, WEBP or GIF - up to 5MB"}
              </span>
            </span>
          </button>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailChange}
          />
          {errors.thumbnail ? <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.thumbnail}</p> : null}
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
            Video (.mp4) {!initial ? <span className="text-red-500">*</span> : null}
          </span>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-lg border border-dashed border-secondary/20 p-3 text-left hover:border-brand-700/40 hover:bg-brand-50/40"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary/5 text-secondary/40">
              <FiFilm className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                <FiUploadCloud className="h-4 w-4" aria-hidden="true" />
                {videoFile ? "Change video" : initial ? "Replace video" : "Upload video"}
              </span>
              <span className="block truncate text-xs text-secondary/50">
                {videoFile?.name || (initial?.videoUrl ? initial.videoUrl.split("/").pop() : `MP4 only - up to ${MAX_VIDEO_MB}MB`)}
              </span>
            </span>
          </button>
          <input ref={videoInputRef} type="file" accept="video/mp4,.mp4" className="hidden" onChange={handleVideoChange} />
          {errors.video ? <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.video}</p> : null}
        </div>

        <SelectField
          id="art-status"
          label="Status"
          value={form.status}
          error={errors.status}
          onChange={(e) => setField("status", e.target.value)}
        >
          <option value="draft">Unpublished</option>
          <option value="published">Published</option>
        </SelectField>

        <TextField
          id="art-order"
          label="Display Order"
          type="number"
          value={form.displayOrder}
          error={errors.displayOrder}
          onChange={(e) => setField("displayOrder", e.target.value)}
        />

        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
