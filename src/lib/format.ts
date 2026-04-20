export function formatMoney(value: number, currencySymbol: string): string {
  const v = Number.isFinite(value) ? value : 0
  const rounded = Math.round(v)
  return `${rounded.toLocaleString()} ${currencySymbol}`
}

export function formatMonthAsYears(monthIndex: number): string {
  if (!Number.isFinite(monthIndex) || monthIndex < 0) return '—'
  const years = monthIndex / 12
  return `${years.toFixed(1)}y`
}
