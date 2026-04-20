import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react'

type BaseProps = {
  label: string
  hint?: string
}

export function NumberField(props: {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  hint?: string
}) {
  const { label, value, onChange, step, min, max, hint } = props
  const [draft, setDraft] = useState(String(Number.isFinite(value) ? value : 0))

  useEffect(() => {
    setDraft(String(Number.isFinite(value) ? value : 0))
  }, [value])

  function commit(rawValue: string) {
    const normalized = rawValue.trim().replace(/,/g, '.')
    if (normalized === '' || normalized === '-' || normalized === '.' || normalized === '-.') {
      setDraft(String(Number.isFinite(value) ? value : 0))
      return
    }

    const parsed = Number(normalized)
    if (!Number.isFinite(parsed)) {
      setDraft(String(Number.isFinite(value) ? value : 0))
      return
    }

    let nextValue = parsed
    if (typeof min === 'number') {
      nextValue = Math.max(min, nextValue)
    }
    if (typeof max === 'number') {
      nextValue = Math.min(max, nextValue)
    }

    onChange(nextValue)
    setDraft(String(nextValue))
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setDraft(e.target.value)
  }

  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-slate-900">{label}</span>
      </div>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        type="text"
        inputMode={step && Number.isInteger(step) ? 'numeric' : 'decimal'}
        value={draft}
        onChange={handleChange}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit((e.target as HTMLInputElement).value)
          }
        }}
      />
      {hint ? <div className="mt-1 text-xs text-slate-600">{hint}</div> : null}
    </label>
  )
}

export function TextField(props: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
}) {
  const { label, value, onChange, hint } = props
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <div className="mt-1 text-xs text-slate-600">{hint}</div> : null}
    </label>
  )
}

export function CheckboxField(props: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}) {
  const { label, checked, onChange, hint } = props
  return (
    <label className="flex items-start gap-2">
      <input
        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="text-sm font-medium text-slate-900">{label}</span>
        {hint ? <div className="text-xs text-slate-600">{hint}</div> : null}
      </span>
    </label>
  )
}

export function Section(props: BaseProps & { children: ReactNode }) {
  const { label, hint, children } = props
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-900">{label}</h2>
        {hint ? <p className="mt-1 text-sm text-slate-600">{hint}</p> : null}
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}
