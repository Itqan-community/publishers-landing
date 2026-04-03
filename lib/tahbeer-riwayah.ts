/** If riwayah name includes "عن", keep only what's before it (e.g. "حفص عن عاصم" → "حفص") */
export function trimRiwayahName(name: string): string {
  const idx = name.indexOf('عن');
  if (idx === -1) return name;
  return name.slice(0, idx).trim();
}
