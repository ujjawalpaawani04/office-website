import { useCallback, useState } from "react";
import { FiEdit2, FiEye, FiFileText, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { blogPostsApi } from "../../api/blogPostsApi";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useConfirmAction } from "../../hooks/useConfirmAction";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";

const STATUS_OPTIONS = ["", "draft", "published"];
const STATUS_LABELS = { draft: "Unpublished", published: "Published" };

export default function BlogPosts() {
  useBreadcrumb([{ label: "Blog Posts" }]);
  const { admin } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const fetcher = useCallback(() => blogPostsApi.list({ page, pageSize: 20, q, status }), [page, q, status]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const deleteAction = useConfirmAction((row) => blogPostsApi.remove(row.id), {
    successMessage: "Post deleted.",
    errorMessage: "Could not delete.",
    showErrorToast: false,
    onSuccess: refetch,
  });

  if (error) return <ErrorState message="Could not load blog posts." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="SEO content published to /blogs."
        action={<Button onClick={() => navigate("/admin/blog/posts/new")}><FiPlus className="h-4 w-4" /> New Post</Button>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by title..." />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s ? STATUS_LABELS[s] : "All statuses"}</option>
          ))}
        </select>
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiFileText, title: "No blog posts yet", description: "Publish your first article." }}
        columns={[
          { key: "title", label: "Title", className: "max-w-sm" },
          { key: "categoryName", label: "Category" },
          { key: "authorName", label: "Author" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "viewsCount", label: "Views" },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            {row.status === "published" ? (
              <Link
                to={`/blog/${row.slug}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Preview ${row.title}`}
                className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
              >
                <FiEye className="h-4 w-4" />
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => navigate(`/admin/blog/posts/${row.id}`)}
              aria-label={`Edit ${row.title}`}
              className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            {admin?.role === "admin" ? (
              <button
                type="button"
                onClick={() => deleteAction.request(row)}
                aria-label={`Delete ${row.title}`}
                className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Delete "${deleteAction.pending?.title}"?`}
        description={deleteAction.error || "This cannot be undone."}
        confirmLabel="Delete"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
