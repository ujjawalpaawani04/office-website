import { useCallback, useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiFilm, FiPlus, FiTrash2, FiX } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { articlesApi } from "../../api/articlesApi";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { ArticleForm } from "./ArticleForm";

function PreviewModal({ article, onClose }) {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-black shadow-xl">
        <div className="flex items-center justify-between bg-secondary px-4 py-3">
          <p className="truncate text-sm font-semibold text-white">{article.title}</p>
          <button type="button" onClick={onClose} aria-label="Close preview" className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
            <FiX className="h-4 w-4" />
          </button>
        </div>
        <video
          key={article.id}
          src={article.videoUrl}
          poster={article.thumbnail}
          controls
          autoPlay
          className="aspect-video w-full bg-black"
        >
          <track kind="captions" />
        </video>
      </div>
    </div>
  );
}

export default function Articles() {
  useBreadcrumb([{ label: "Articles" }]);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetcher = useCallback(() => articlesApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleToggleStatus = async (row) => {
    setTogglingId(row.id);
    try {
      await articlesApi.update(row.id, {
        title: row.title,
        shortDescription: row.shortDescription,
        displayOrder: row.displayOrder,
        status: row.status === "published" ? "draft" : "published",
      });
      showToast(row.status === "published" ? "Article unpublished." : "Article published.");
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update status.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await articlesApi.remove(pendingDelete.id);
      showToast("Article deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message="Could not load articles." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Articles"
        description="The video showcase shown as 'Insights & Articles' on the Life@SAA page."
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> Add Article</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by title..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiFilm, title: "No articles yet", description: "Add your first video article to show it on the public site." }}
        columns={[
          {
            key: "thumbnail",
            label: "Thumbnail",
            render: (row) => (
              <img src={row.thumbnail} alt="" className="h-12 w-20 rounded-md object-cover" loading="lazy" />
            ),
          },
          { key: "title", label: "Title" },
          { key: "displayOrder", label: "Order" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setPreviewing(row)} aria-label={`Preview ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiFilm className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleToggleStatus(row)}
              disabled={togglingId === row.id}
              aria-label={row.status === "published" ? `Unpublish ${row.title}` : `Publish ${row.title}`}
              className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary disabled:opacity-50"
            >
              {row.status === "published" ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <ArticleForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
      />
      <PreviewModal article={previewing} onClose={() => setPreviewing(null)} />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This permanently removes the article, its thumbnail, and its video from the server. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
