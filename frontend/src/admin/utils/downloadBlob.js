// Shared "trigger a browser download from an in-memory blob" helper - used
// by résumé download and every CSV export, all of which fetch an
// authenticated response rather than linking a public URL.
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  link.click();
  URL.revokeObjectURL(url);
}
