import { useCallback, useState } from "react";
import { FiAward, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { certificationsApi } from "../../api/certificationsApi";
import { ActiveBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useConfirmAction } from "../../hooks/useConfirmAction";
import { useDrawerForm } from "../../hooks/useDrawerForm";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { CertificationForm } from "./CertificationForm";

export default function Certifications() {
  useBreadcrumb([{ label: "Certifications" }]);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const fetcher = useCallback(() => certificationsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const { formKey, formProps, openCreate, openEdit } = useDrawerForm(refetch);
  const deleteAction = useConfirmAction((row) => certificationsApi.remove(row.id), {
    successMessage: "Certification deactivated.",
    errorMessage: "Could not deactivate.",
    onSuccess: refetch,
  });

  if (error) return <ErrorState message="Could not load certifications." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Certifications"
        description="ICAI/ISO/Udyam-style badges shown on the About page."
        action={<Button onClick={openCreate}><FiPlus className="h-4 w-4" /> Add Certification</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiAward, title: "No certifications yet" }}
        columns={[
          { key: "name", label: "Name" },
          { key: "issuingBody", label: "Issuing Body" },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => deleteAction.request(row)} aria-label={`Deactivate ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <CertificationForm key={formKey} {...formProps} />
      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Deactivate "${deleteAction.pending?.name}"?`}
        confirmLabel="Deactivate"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
