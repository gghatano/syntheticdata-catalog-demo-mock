export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return `${formatDate(isoString)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatScore(score: number): string {
  return (score * 100).toFixed(1) + "%";
}
