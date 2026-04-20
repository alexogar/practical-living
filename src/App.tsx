import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CheckboxField, NumberField, Section, TextField } from './components/Fields'
import { defaultFormState, type FormState } from './lib/defaultFormState'
import { formatMoney, formatMonthAsYears } from './lib/format'
import { estimateHouseholdCosts } from './lib/householdEstimate'
import { translations, translateSimulationWarning, type Locale, type Translation } from './lib/i18n'
import { simulate, type StrategyKey } from './lib/simulate'

type Snapshot = {
  id: number
  summaries: ReturnType<typeof simulate>['summaries']
}

type ResultRow = {
  key: StrategyKey
  label: string
  color: string
  summary: ReturnType<typeof simulate>['summaries'][StrategyKey]
  baselineDelta: number
}

function App() {
  const [form, setForm] = useState<FormState>(defaultFormState)
  const [stepIndex, setStepIndex] = useState(0)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [locale, setLocale] = useState<Locale>('en')
  const [selectedStrategyKey, setSelectedStrategyKey] = useState<StrategyKey>('rentInvest')

  const copy = translations[locale]
  const strategyLabels = copy.strategyLabels
  const effectiveAnnualNetIncome = form.monthlyNetIncomeEnabled
    ? form.monthlyNetIncome * 12
    : form.annualNetIncome
  const effectiveMonthlyNetIncome = form.monthlyNetIncomeEnabled
    ? form.monthlyNetIncome
    : form.annualNetIncome / 12

  const householdEstimate = useMemo(
    () =>
      estimateHouseholdCosts({
        householdAdults: form.householdAdults,
        householdChildren: form.householdChildren,
        householdLifestylePct: form.householdLifestylePct,
        householdTransportMonthly: form.householdTransportMonthly,
        householdInsuranceMonthly: form.householdInsuranceMonthly,
        householdDiningMonthly: form.householdDiningMonthly,
        householdVacationYearly: form.householdVacationYearly,
        householdChildcareMonthly: form.householdChildcareMonthly,
      }),
    [form],
  )

  const sim = useMemo(
    () =>
      simulate({
        horizonYears: form.horizonYears,
        initialCash: form.initialCash,
        annualNetIncome: form.annualNetIncome,
        monthlyNetIncome: form.monthlyNetIncomeEnabled ? form.monthlyNetIncome : undefined,
        monthlyNonHousingCosts: form.monthlyNonHousingCosts,
        investmentReturnAnnualPct: form.investmentReturnAnnualPct,
        buyAfterYears: form.buyAfterYears,
        livingRent: {
          monthlyRent: form.livingRentMonthly,
          growthAnnualPct: form.livingRentGrowthAnnualPct,
        },
        buyToLive: {
          price: form.homePrice,
          downPaymentPct: form.homeDownPaymentPct,
          growthAnnualPct: form.homeGrowthAnnualPct,
          purchaseCosts: {
            transferTaxPct: form.homeTransferTaxPct,
            notaryAndRegistryPct: form.homeNotaryAndRegistryPct,
            agentPct: form.homeAgentPct,
            otherFixed: form.homeOtherFixed,
          },
          mortgage: {
            enabled: true,
            interestAnnualPct: form.homeInterestAnnualPct,
            termYears: form.homeTermYears,
            specialRepaymentAnnualPct: form.homeSpecialRepaymentAnnualPct,
            useSurplusForPrepayment: form.homeUseSurplusForPrepayment,
          },
          maintenanceAnnualPct: form.homeMaintenanceAnnualPct,
          fixedMonthlyCosts: form.homeFixedMonthlyCosts,
        },
        buyToLetProperty: {
          price: form.rentalPrice,
          downPaymentPct: form.rentalDownPaymentPct,
          growthAnnualPct: form.rentalGrowthAnnualPct,
          purchaseCosts: {
            transferTaxPct: form.rentalTransferTaxPct,
            notaryAndRegistryPct: form.rentalNotaryAndRegistryPct,
            agentPct: form.rentalAgentPct,
            otherFixed: form.rentalOtherFixed,
          },
          mortgage: {
            enabled: form.rentalMortgageEnabled,
            interestAnnualPct: form.rentalInterestAnnualPct,
            termYears: form.rentalTermYears,
            specialRepaymentAnnualPct: form.rentalSpecialRepaymentAnnualPct,
            useSurplusForPrepayment: form.rentalUseSurplusForPrepayment,
          },
          maintenanceAnnualPct: form.rentalMaintenanceAnnualPct,
          fixedMonthlyCosts: form.rentalFixedMonthlyCosts,
        },
        buyToLetRentalIncome: {
          monthlyColdRent: form.rentalColdRentMonthly,
          growthAnnualPct: form.rentalRentGrowthAnnualPct,
          vacancyPct: form.rentalVacancyPct,
          nonRecoverableMonthlyCosts: form.rentalNonRecoverableMonthlyCosts,
          managementFeePct: form.rentalManagementFeePct,
        },
        buyToLetTaxes: {
          marginalIncomeTaxPct: form.rentalMarginalIncomeTaxPct,
          solidarityPctOnIncomeTax: form.rentalSolidarityPctOnIncomeTax,
          churchTaxPctOnIncomeTax: form.rentalChurchTaxPctOnIncomeTax,
          depreciationAnnualPct: form.rentalDepreciationAnnualPct,
          buildingSharePct: form.rentalBuildingSharePct,
        },
      }),
    [form],
  )

  const netWorthChartData = sim.points.map((point) => ({
    year: Number(point.year.toFixed(2)),
    rentInvest: point.rentInvest,
    buyToLive: point.buyToLive,
    rentThenBuy: point.rentThenBuy,
    rentPlusBuyToLet: point.rentPlusBuyToLet,
  }))

  const mortgageChartData = sim.points.map((point) => ({
    year: Number(point.year.toFixed(2)),
    buyToLiveMortgageBalance: point.buyToLiveMortgageBalance,
    rentThenBuyMortgageBalance: point.rentThenBuyMortgageBalance,
    buyToLetMortgageBalance: point.buyToLetMortgageBalance,
  }))

  const resultRows: ResultRow[] = [
    {
      key: 'rentInvest',
      label: strategyLabels.rentInvest,
      color: '#0f172a',
      summary: sim.summaries.rentInvest,
      baselineDelta: 0,
    },
    {
      key: 'buyToLive',
      label: strategyLabels.buyToLive,
      color: '#4338ca',
      summary: sim.summaries.buyToLive,
      baselineDelta:
        sim.summaries.buyToLive.finalNetWorth - sim.summaries.rentInvest.finalNetWorth,
    },
    {
      key: 'rentThenBuy',
      label: strategyLabels.rentThenBuy,
      color: '#d97706',
      summary: sim.summaries.rentThenBuy,
      baselineDelta:
        sim.summaries.rentThenBuy.finalNetWorth - sim.summaries.rentInvest.finalNetWorth,
    },
    {
      key: 'rentPlusBuyToLet',
      label: strategyLabels.rentPlusBuyToLet,
      color: '#059669',
      summary: sim.summaries.rentPlusBuyToLet,
      baselineDelta:
        sim.summaries.rentPlusBuyToLet.finalNetWorth - sim.summaries.rentInvest.finalNetWorth,
    },
  ]

  const quickScenarios = [
    {
      id: 'invest-instead',
      label: copy.quickActions.investInstead,
      description: copy.quickActions.investInsteadDescription,
      active:
        form.homeSpecialRepaymentAnnualPct === 0 &&
        !form.homeUseSurplusForPrepayment &&
        form.rentalSpecialRepaymentAnnualPct === 0 &&
        !form.rentalUseSurplusForPrepayment,
      apply: () =>
        setForm((previous) => ({
          ...previous,
          homeSpecialRepaymentAnnualPct: 0,
          homeUseSurplusForPrepayment: false,
          rentalSpecialRepaymentAnnualPct: 0,
          rentalUseSurplusForPrepayment: false,
        })),
    },
    {
      id: 'aggressive-home',
      label: copy.quickActions.aggressiveHome,
      description: copy.quickActions.aggressiveHomeDescription,
      active: form.homeSpecialRepaymentAnnualPct === 5 && form.homeUseSurplusForPrepayment,
      apply: () =>
        setForm((previous) => ({
          ...previous,
          homeSpecialRepaymentAnnualPct: 5,
          homeUseSurplusForPrepayment: true,
        })),
    },
    {
      id: 'aggressive-rental',
      label: copy.quickActions.aggressiveRental,
      description: copy.quickActions.aggressiveRentalDescription,
      active: form.rentalSpecialRepaymentAnnualPct === 5 && form.rentalUseSurplusForPrepayment,
      apply: () =>
        setForm((previous) => ({
          ...previous,
          rentalSpecialRepaymentAnnualPct: 5,
          rentalUseSurplusForPrepayment: true,
        })),
    },
    {
      id: 'wait-longer',
      label: copy.quickActions.waitLonger,
      description: copy.quickActions.waitLongerDescription,
      active: form.buyAfterYears === 4 && form.homeDownPaymentPct === 30,
      apply: () =>
        setForm((previous) => ({
          ...previous,
          buyAfterYears: 4,
          homeDownPaymentPct: 30,
        })),
    },
  ]

  const activeScenarioLabels = quickScenarios.filter((scenario) => scenario.active).map((scenario) => scenario.label)

  const comparisonBarData = resultRows.map((row) => ({
    strategy: row.label,
    value: row.summary.finalNetWorth,
    fill: row.color,
  }))

  const selectedSummary = sim.summaries[selectedStrategyKey]
  const budgetDonutData = [
    {
      name: copy.charts.nonHousing,
      value: Math.max(0, form.monthlyNonHousingCosts),
      color: '#94a3b8',
    },
    {
      name: copy.charts.housing,
      value: Math.max(0, selectedSummary.currentMonthlyPayment),
      color: resultRows.find((row) => row.key === selectedStrategyKey)?.color ?? '#0f172a',
    },
    {
      name:
        selectedSummary.currentMonthlyContribution >= 0
          ? copy.charts.savings
          : copy.charts.shortfall,
      value: Math.abs(selectedSummary.currentMonthlyContribution),
      color: selectedSummary.currentMonthlyContribution >= 0 ? '#22c55e' : '#ef4444',
    },
  ].filter((segment) => segment.value > 0)

  const cashflowRows = resultRows.map((row) => ({
    key: row.key,
    label: row.label,
    payment: row.summary.currentMonthlyPayment,
    mortgage: row.summary.currentMonthlyMortgagePayment,
    extra: row.summary.currentMonthlyExtraRepayment,
    investable: row.summary.currentMonthlyContribution,
  }))

  function captureSnapshot() {
    setSnapshots((previous) => {
      const nextId = (previous.at(-1)?.id ?? 0) + 1
      return [...previous.slice(-2), { id: nextId, summaries: sim.summaries }]
    })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f8fafc_30%,#e2e8f0_100%)] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{copy.header.eyebrow}</p>
                <LocaleSwitcher locale={locale} setLocale={setLocale} copy={copy} />
              </div>
              <h1 className="mt-2 font-serif text-3xl leading-tight text-slate-950 sm:text-4xl">{copy.header.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{copy.header.intro}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[480px]">
              <SummaryCard
                label={copy.summary.horizon}
                value={`${form.horizonYears}y`}
                detail={copy.summary.editStep}
                note={copy.summary.readOnly}
                onClick={() => setStepIndex(0)}
              />
              <SummaryCard
                label={copy.summary.income}
                value={formatMoney(effectiveMonthlyNetIncome, form.currencySymbol)}
                detail={copy.summary.activeInput}
                note={`${form.monthlyNetIncomeEnabled ? copy.fields.monthlyNetIncome : copy.fields.annualNetIncome} · ${formatMoney(effectiveAnnualNetIncome, form.currencySymbol)} / year`}
                onClick={() => setStepIndex(0)}
              />
              <SummaryCard
                label={copy.summary.livingCosts}
                value={formatMoney(form.monthlyNonHousingCosts, form.currencySymbol)}
                detail={copy.summary.editStep}
                note={copy.fields.monthlyNonHousingCosts}
                onClick={() => setStepIndex(0)}
              />
              <SummaryCard
                label={copy.summary.cashToday}
                value={formatMoney(form.initialCash, form.currencySymbol)}
                detail={copy.summary.readOnly}
                note={copy.summary.planningLabel}
                onClick={() => setStepIndex(0)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:px-8">
        <div className="grid gap-4">
          <Section label={copy.summary.planningLabel} hint={copy.summary.planningHint}>
            <div className="grid gap-3 sm:grid-cols-2">
              <ExplanationCard title={copy.readThis.finalNetWorthTitle} body={copy.readThis.finalNetWorthBody} />
              <ExplanationCard title={copy.readThis.monthlyInvestableTitle} body={copy.readThis.monthlyInvestableBody} />
            </div>
          </Section>

          <Section label={copy.guided.label} hint={copy.guided.steps[stepIndex].prompt}>
            <div className="grid gap-3 sm:grid-cols-3">
              {copy.guided.steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left transition',
                    index === stepIndex
                      ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white',
                  ].join(' ')}
                >
                  <div className="text-xs uppercase tracking-[0.16em] opacity-70">{copy.guided.stepBadge}</div>
                  <div className="mt-1 text-sm font-semibold">{step.title}</div>
                </button>
              ))}
            </div>

            {stepIndex === 0 ? <MoneyStep form={form} setForm={setForm} copy={copy} householdEstimateTotal={householdEstimate.total} householdEstimate={householdEstimate} /> : null}
            {stepIndex === 1 ? <LiveAndBuyStep form={form} setForm={setForm} copy={copy} /> : null}
            {stepIndex === 2 ? <BuyToLetStep form={form} setForm={setForm} copy={copy} compact /> : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
                disabled={stepIndex === 0}
              >
                {copy.guided.back}
              </button>
              <div className="text-xs text-slate-500">{copy.guided.advancedHint}</div>
              <button
                type="button"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setStepIndex((value) => Math.min(copy.guided.steps.length - 1, value + 1))}
                disabled={stepIndex === copy.guided.steps.length - 1}
              >
                {copy.guided.next}
              </button>
            </div>
          </Section>

          <Section label={copy.quickActions.label} hint={copy.quickActions.hint}>
            <div className="grid gap-3 md:grid-cols-2">
              {quickScenarios.map((scenario) => (
                <QuickScenarioCard
                  key={scenario.id}
                  label={scenario.label}
                  description={scenario.description}
                  active={scenario.active}
                  activeBadge={copy.quickActions.activeBadge}
                  inactiveBadge={copy.quickActions.inactiveBadge}
                  onClick={scenario.apply}
                />
              ))}
              <button
                type="button"
                className="flex min-h-[132px] flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-left transition hover:border-slate-500"
                onClick={captureSnapshot}
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Utility</div>
                  <div className="mt-2 text-base font-semibold text-slate-950">{copy.quickActions.saveScenario}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy.quickActions.saveScenarioHint}</p>
                </div>
              </button>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.quickActions.currentLabel}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeScenarioLabels.length === 0 ? (
                  <span className="text-sm text-slate-600">{copy.quickActions.noScenario}</span>
                ) : (
                  activeScenarioLabels.map((label) => (
                    <span key={label} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                      {label}
                    </span>
                  ))
                )}
              </div>
            </div>
          </Section>

          <Section label={copy.advanced.label} hint={copy.advanced.hint}>
            <div className="grid gap-3">
              <details className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">{copy.advanced.money}</summary>
                <div className="mt-4">
                  <MoneyStep form={form} setForm={setForm} copy={copy} householdEstimateTotal={householdEstimate.total} householdEstimate={householdEstimate} />
                </div>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">{copy.advanced.liveAndBuy}</summary>
                <div className="mt-4">
                  <LiveAndBuyStep form={form} setForm={setForm} copy={copy} />
                </div>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">{copy.advanced.buyToLet}</summary>
                <div className="mt-4">
                  <BuyToLetStep form={form} setForm={setForm} copy={copy} />
                </div>
              </details>
            </div>
          </Section>
        </div>

        <div className="grid content-start gap-4">
          <ResultsSection
            form={form}
            rows={resultRows}
            copy={copy}
            selectedStrategyKey={selectedStrategyKey}
            onSelectStrategy={setSelectedStrategyKey}
          />

          <Section label={copy.cashflow.label} hint={copy.cashflow.hint}>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-[640px] divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{copy.cashflow.strategy}</th>
                    <th className="px-4 py-3">{copy.cashflow.monthlyPayment}</th>
                    <th className="px-4 py-3">{copy.cashflow.mortgagePart}</th>
                    <th className="px-4 py-3">{copy.cashflow.extraPayoff}</th>
                    <th className="px-4 py-3">{copy.cashflow.investableCash}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashflowRows.map((row) => (
                    <tr key={row.key}>
                      <td className="px-4 py-3 font-medium text-slate-900">{row.label}</td>
                      <td className="px-4 py-3 text-slate-700">{formatMoney(row.payment, form.currencySymbol)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatMoney(row.mortgage, form.currencySymbol)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatMoney(row.extra, form.currencySymbol)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatSignedMoney(row.investable, form.currencySymbol)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section label={copy.charts.comparisonLabel} hint={copy.charts.comparisonHint}>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="h-[280px] w-full sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonBarData} margin={{ top: 12, right: 12, left: 0, bottom: 10 }}>
                      <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                      <XAxis dataKey="strategy" angle={-18} textAnchor="end" height={60} interval={0} stroke="#475569" />
                      <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} stroke="#475569" />
                      <Tooltip formatter={(value) => formatMoney(Number(value), form.currencySymbol)} />
                      <Bar dataKey="value" name={copy.charts.finalNetWorth} radius={[12, 12, 0, 0]}>
                        {comparisonBarData.map((entry) => (
                          <Cell key={entry.strategy} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.charts.selectedStrategy}</span>
                  {resultRows.map((row) => (
                    <button
                      key={row.key}
                      type="button"
                      className={[
                        'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                        selectedStrategyKey === row.key
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500',
                      ].join(' ')}
                      onClick={() => setSelectedStrategyKey(row.key)}
                    >
                      {row.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-slate-600">{copy.charts.budgetHint}</div>
                <div className="mt-4 h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetDonutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={94}
                        paddingAngle={2}
                      >
                        {budgetDonutData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatMoney(Number(value), form.currencySymbol)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {budgetDonutData.map((entry) => (
                    <div key={entry.name} className="rounded-2xl bg-slate-50 p-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        {entry.name}
                      </div>
                      <div className="mt-1 font-semibold text-slate-950">{formatMoney(entry.value, form.currencySymbol)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section label={copy.charts.netWorthLabel} hint={copy.charts.netWorthHint}>
            <div className="h-[280px] w-full sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={netWorthChartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickFormatter={(value) => `${value}y`} stroke="#475569" />
                  <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} stroke="#475569" />
                  <Tooltip
                    formatter={(value) => formatMoney(Number(value), form.currencySymbol)}
                    labelFormatter={(label) => copy.charts.yearLabel(label)}
                    contentStyle={{ borderRadius: 16, borderColor: '#cbd5e1' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="rentInvest" name={strategyLabels.rentInvest} stroke="#0f172a" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                  <Line type="monotone" dataKey="buyToLive" name={strategyLabels.buyToLive} stroke="#4338ca" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                  <Line type="monotone" dataKey="rentThenBuy" name={strategyLabels.rentThenBuy} stroke="#d97706" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                  <Line type="monotone" dataKey="rentPlusBuyToLet" name={strategyLabels.rentPlusBuyToLet} stroke="#059669" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section label={copy.charts.mortgageLabel} hint={copy.charts.mortgageHint}>
            <div className="h-[260px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mortgageChartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickFormatter={(value) => `${value}y`} stroke="#475569" />
                  <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} stroke="#475569" />
                  <Tooltip
                    formatter={(value) => formatMoney(Number(value), form.currencySymbol)}
                    labelFormatter={(label) => copy.charts.yearLabel(label)}
                    contentStyle={{ borderRadius: 16, borderColor: '#cbd5e1' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="buyToLiveMortgageBalance" name={`${strategyLabels.buyToLive} mortgage`} stroke="#4338ca" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                  <Line type="monotone" dataKey="rentThenBuyMortgageBalance" name={`${strategyLabels.rentThenBuy} mortgage`} stroke="#d97706" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                  <Line type="monotone" dataKey="buyToLetMortgageBalance" name={`${strategyLabels.rentPlusBuyToLet} mortgage`} stroke="#059669" dot={false} strokeWidth={2.5} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <ScenarioCompareSection form={form} snapshots={snapshots} copy={copy} />

          <Warnings sim={sim} copy={copy} locale={locale} />
        </div>
      </main>
    </div>
  )
}

function LocaleSwitcher(props: {
  locale: Locale
  setLocale: Dispatch<SetStateAction<Locale>>
  copy: Translation
}) {
  const { locale, setLocale, copy } = props
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
      <span className="font-semibold uppercase tracking-[0.14em]">{copy.languageLabel}</span>
      {(['en', 'de'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={[
            'rounded-full border px-3 py-1.5 transition',
            option === locale
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500',
          ].join(' ')}
        >
          {copy.languages[option]}
        </button>
      ))}
    </div>
  )
}

function SummaryCard(props: {
  label: string
  value: string
  detail: string
  note: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left shadow-sm transition hover:border-slate-400 hover:bg-white"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{props.label}</div>
      <div className="mt-2 text-xl font-semibold text-slate-950">{props.value}</div>
      <div className="mt-2 text-xs text-slate-600">{props.detail}</div>
      <div className="mt-1 text-xs text-slate-500">{props.note}</div>
    </button>
  )
}

function QuickScenarioCard(props: {
  label: string
  description: string
  active: boolean
  activeBadge: string
  inactiveBadge: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        'flex min-h-[132px] flex-col justify-between rounded-2xl border p-4 text-left transition',
        props.active
          ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400',
      ].join(' ')}
    >
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
          {props.active ? props.activeBadge : props.inactiveBadge}
        </div>
        <div className="mt-2 text-base font-semibold">{props.label}</div>
        <p className="mt-2 text-sm leading-6 opacity-85">{props.description}</p>
      </div>
    </button>
  )
}

function ExplanationCard(props: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">{props.title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{props.body}</p>
    </div>
  )
}

function MoneyStep(props: {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  copy: Translation
  householdEstimateTotal: number
  householdEstimate: ReturnType<typeof estimateHouseholdCosts>
}) {
  const { form, setForm, copy, householdEstimateTotal, householdEstimate } = props
  const annualEquivalent = formatMoney(form.monthlyNetIncome * 12, form.currencySymbol)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TextField
        label={copy.fields.currencySymbol}
        value={form.currencySymbol}
        onChange={(value) => setForm((previous) => ({ ...previous, currencySymbol: value || '€' }))}
      />
      <NumberField
        label={copy.fields.horizonYears}
        value={form.horizonYears}
        min={1}
        step={1}
        onChange={(value) => setForm((previous) => ({ ...previous, horizonYears: Math.max(1, value) }))}
      />
      <NumberField
        label={copy.fields.annualNetIncome}
        hint={copy.fields.annualNetIncomeHint}
        value={form.annualNetIncome}
        step={1000}
        onChange={(value) => setForm((previous) => ({ ...previous, annualNetIncome: value }))}
      />
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <CheckboxField
          label={copy.fields.monthlyNetIncomeToggle}
          hint={copy.fields.monthlyNetIncomeToggleHint}
          checked={form.monthlyNetIncomeEnabled}
          onChange={(checked) => setForm((previous) => ({ ...previous, monthlyNetIncomeEnabled: checked }))}
        />
        <div className="mt-4">
          <NumberField
            label={copy.fields.monthlyNetIncome}
            hint={copy.fields.monthlyNetIncomeHint}
            value={form.monthlyNetIncome}
            step={100}
            onChange={(value) => setForm((previous) => ({ ...previous, monthlyNetIncome: value }))}
          />
        </div>
        <div className="mt-3 text-xs text-slate-600">
          {form.monthlyNetIncomeEnabled
            ? copy.fields.monthlyNetIncomeActiveHint(annualEquivalent)
            : copy.fields.annualNetIncomeActiveHint}
        </div>
      </div>
      <NumberField
        label={copy.fields.monthlyNonHousingCosts}
        hint={copy.fields.monthlyNonHousingCostsHint}
        value={form.monthlyNonHousingCosts}
        step={50}
        onChange={(value) => setForm((previous) => ({ ...previous, monthlyNonHousingCosts: value }))}
      />
      <NumberField
        label={copy.fields.initialCash}
        value={form.initialCash}
        step={1000}
        onChange={(value) => setForm((previous) => ({ ...previous, initialCash: value }))}
      />
      <div className="lg:col-span-2 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <div className="text-sm font-semibold text-amber-950">{copy.estimator.label}</div>
        <p className="mt-2 text-sm leading-6 text-amber-900">{copy.estimator.hint}</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <NumberField
            label={copy.fields.householdAdults}
            value={form.householdAdults}
            min={1}
            step={1}
            onChange={(value) => setForm((previous) => ({ ...previous, householdAdults: Math.max(1, value) }))}
          />
          <NumberField
            label={copy.fields.householdChildren}
            value={form.householdChildren}
            min={0}
            step={1}
            onChange={(value) => setForm((previous) => ({ ...previous, householdChildren: Math.max(0, value) }))}
          />
          <NumberField
            label={copy.fields.householdLifestylePct}
            value={form.householdLifestylePct}
            min={70}
            max={150}
            step={5}
            onChange={(value) => setForm((previous) => ({ ...previous, householdLifestylePct: value }))}
          />
          <NumberField
            label={copy.fields.householdTransportMonthly}
            value={form.householdTransportMonthly}
            step={25}
            onChange={(value) => setForm((previous) => ({ ...previous, householdTransportMonthly: value }))}
          />
          <NumberField
            label={copy.fields.householdInsuranceMonthly}
            value={form.householdInsuranceMonthly}
            step={25}
            onChange={(value) => setForm((previous) => ({ ...previous, householdInsuranceMonthly: value }))}
          />
          <NumberField
            label={copy.fields.householdDiningMonthly}
            value={form.householdDiningMonthly}
            step={25}
            onChange={(value) => setForm((previous) => ({ ...previous, householdDiningMonthly: value }))}
          />
          <NumberField
            label={copy.fields.householdVacationYearly}
            value={form.householdVacationYearly}
            step={250}
            onChange={(value) => setForm((previous) => ({ ...previous, householdVacationYearly: value }))}
          />
          <NumberField
            label={copy.fields.householdChildcareMonthly}
            value={form.householdChildcareMonthly}
            step={25}
            onChange={(value) => setForm((previous) => ({ ...previous, householdChildcareMonthly: value }))}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <EstimatorMetric label={copy.estimator.groceries} value={formatMoney(householdEstimate.groceries, form.currencySymbol)} />
          <EstimatorMetric label={copy.estimator.essentials} value={formatMoney(householdEstimate.essentials, form.currencySymbol)} />
          <EstimatorMetric label={copy.estimator.lifestyleAdjustment} value={formatSignedMoney(householdEstimate.lifestyleAdjustment, form.currencySymbol)} />
          <EstimatorMetric label={copy.estimator.estimateReady} value={formatMoney(householdEstimateTotal, form.currencySymbol)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-amber-900">{copy.estimator.roughModel}</p>
          <button
            type="button"
            className="rounded-full bg-amber-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-900"
            onClick={() => setForm((previous) => ({ ...previous, monthlyNonHousingCosts: Math.round(householdEstimateTotal) }))}
          >
            {copy.estimator.useEstimate}
          </button>
        </div>
      </div>
      <NumberField
        label={copy.fields.investmentReturn}
        value={form.investmentReturnAnnualPct}
        step={0.1}
        onChange={(value) => setForm((previous) => ({ ...previous, investmentReturnAnnualPct: value }))}
      />
    </div>
  )
}

function EstimatorMetric(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-3 text-sm">
      <div className="text-slate-600">{props.label}</div>
      <div className="mt-1 font-semibold text-slate-950">{props.value}</div>
    </div>
  )
}

function RentingStep(props: {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  copy: Translation
}) {
  const { form, setForm, copy } = props
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <NumberField
        label={copy.fields.expectedRent}
        value={form.livingRentMonthly}
        step={50}
        onChange={(value) => setForm((previous) => ({ ...previous, livingRentMonthly: value }))}
      />
      <NumberField
        label={copy.fields.rentGrowth}
        value={form.livingRentGrowthAnnualPct}
        step={0.1}
        onChange={(value) => setForm((previous) => ({ ...previous, livingRentGrowthAnnualPct: value }))}
      />
      <NumberField
        label={copy.fields.buyAfterYears}
        hint={copy.fields.buyAfterYearsHint}
        value={form.buyAfterYears}
        step={0.5}
        min={0}
        onChange={(value) => setForm((previous) => ({ ...previous, buyAfterYears: Math.max(0, value) }))}
      />
    </div>
  )
}

function LiveAndBuyStep(props: {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  copy: Translation
}) {
  const { copy } = props
  return (
    <div className="grid gap-5">
      <div>
        <div className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.whereYouLive}</div>
        <RentingStep {...props} />
      </div>
      <div>
        <div className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.buyHome}</div>
        <BuyHomeStep {...props} compact />
      </div>
    </div>
  )
}

function BuyHomeStep(props: {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  copy: Translation
  compact?: boolean
}) {
  const { form, setForm, copy, compact } = props
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <NumberField label={copy.fields.homePrice} value={form.homePrice} step={5000} onChange={(value) => setForm((previous) => ({ ...previous, homePrice: value }))} />
        <NumberField label={copy.fields.downPayment} value={form.homeDownPaymentPct} min={0} max={100} step={1} onChange={(value) => setForm((previous) => ({ ...previous, homeDownPaymentPct: value }))} />
        <NumberField label={copy.fields.mortgageInterest} value={form.homeInterestAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, homeInterestAnnualPct: value }))} />
        <NumberField label={copy.fields.mortgageTerm} value={form.homeTermYears} min={1} step={1} onChange={(value) => setForm((previous) => ({ ...previous, homeTermYears: Math.max(1, value) }))} />
        <NumberField label={copy.fields.specialRepayment} hint={copy.fields.specialRepaymentHomeHint} value={form.homeSpecialRepaymentAnnualPct} min={0} max={5} step={0.5} onChange={(value) => setForm((previous) => ({ ...previous, homeSpecialRepaymentAnnualPct: value }))} />
        <CheckboxField label={copy.fields.useSurplusForHomePrepayment} hint={copy.fields.useSurplusForHomePrepaymentHint} checked={form.homeUseSurplusForPrepayment} onChange={(checked) => setForm((previous) => ({ ...previous, homeUseSurplusForPrepayment: checked }))} />
        <NumberField label={copy.fields.propertyGrowth} value={form.homeGrowthAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, homeGrowthAnnualPct: value }))} />
        <NumberField label={copy.fields.maintenance} value={form.homeMaintenanceAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, homeMaintenanceAnnualPct: value }))} />
        <NumberField label={copy.fields.ownerCostsMonthly} value={form.homeFixedMonthlyCosts} step={25} onChange={(value) => setForm((previous) => ({ ...previous, homeFixedMonthlyCosts: value }))} />
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.berlinDefaults}</div>
        <div className="grid gap-4 lg:grid-cols-2">
          <NumberField label={copy.fields.transferTax} value={form.homeTransferTaxPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, homeTransferTaxPct: value }))} />
          <NumberField label={copy.fields.notaryAndRegistry} value={form.homeNotaryAndRegistryPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, homeNotaryAndRegistryPct: value }))} />
          <NumberField label={copy.fields.agentFee} value={form.homeAgentPct} step={0.01} onChange={(value) => setForm((previous) => ({ ...previous, homeAgentPct: value }))} />
          <NumberField label={copy.fields.otherOneTimeCosts} value={form.homeOtherFixed} step={1000} onChange={(value) => setForm((previous) => ({ ...previous, homeOtherFixed: value }))} />
        </div>
      </div>
      {compact ? null : <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{copy.fields.homeMonthlyCostHint}</div>}
    </div>
  )
}

function BuyToLetStep(props: {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  copy: Translation
  compact?: boolean
}) {
  const { form, setForm, copy, compact } = props
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <NumberField label={copy.fields.rentalPrice} value={form.rentalPrice} step={5000} onChange={(value) => setForm((previous) => ({ ...previous, rentalPrice: value }))} />
        <NumberField label={copy.fields.downPayment} value={form.rentalDownPaymentPct} min={0} max={100} step={1} onChange={(value) => setForm((previous) => ({ ...previous, rentalDownPaymentPct: value }))} />
        <CheckboxField label={copy.fields.rentalMortgageEnabled} checked={form.rentalMortgageEnabled} onChange={(checked) => setForm((previous) => ({ ...previous, rentalMortgageEnabled: checked }))} />
        <div />
        <NumberField label={copy.fields.mortgageInterest} value={form.rentalInterestAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalInterestAnnualPct: value }))} />
        <NumberField label={copy.fields.mortgageTerm} value={form.rentalTermYears} min={1} step={1} onChange={(value) => setForm((previous) => ({ ...previous, rentalTermYears: Math.max(1, value) }))} />
        <NumberField label={copy.fields.specialRepayment} hint={copy.fields.specialRepaymentRentalHint} value={form.rentalSpecialRepaymentAnnualPct} min={0} max={5} step={0.5} onChange={(value) => setForm((previous) => ({ ...previous, rentalSpecialRepaymentAnnualPct: value }))} />
        <CheckboxField label={copy.fields.useSurplusForRentalPrepayment} checked={form.rentalUseSurplusForPrepayment} onChange={(checked) => setForm((previous) => ({ ...previous, rentalUseSurplusForPrepayment: checked }))} />
        <NumberField label={copy.fields.propertyGrowth} value={form.rentalGrowthAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalGrowthAnnualPct: value }))} />
        <NumberField label={copy.fields.maintenance} value={form.rentalMaintenanceAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalMaintenanceAnnualPct: value }))} />
        <NumberField label={copy.fields.ownerCostsMonthly} value={form.rentalFixedMonthlyCosts} step={25} onChange={(value) => setForm((previous) => ({ ...previous, rentalFixedMonthlyCosts: value }))} />
      </div>

      <div className="rounded-2xl bg-emerald-50/80 p-4">
        <div className="mb-3 text-sm font-semibold text-emerald-950">{copy.sections.rentalIncome}</div>
        <div className="grid gap-4 lg:grid-cols-2">
          <NumberField label={copy.fields.monthlyColdRent} value={form.rentalColdRentMonthly} step={25} onChange={(value) => setForm((previous) => ({ ...previous, rentalColdRentMonthly: value }))} />
          <NumberField label={copy.fields.rentGrowth} value={form.rentalRentGrowthAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalRentGrowthAnnualPct: value }))} />
          <NumberField label={copy.fields.vacancy} value={form.rentalVacancyPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalVacancyPct: value }))} />
          <NumberField label={copy.fields.nonRecoverableCosts} value={form.rentalNonRecoverableMonthlyCosts} step={10} onChange={(value) => setForm((previous) => ({ ...previous, rentalNonRecoverableMonthlyCosts: value }))} />
          <NumberField label={copy.fields.managementFee} value={form.rentalManagementFeePct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalManagementFeePct: value }))} />
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50/90 p-4">
        <div className="mb-3 text-sm font-semibold text-amber-950">{copy.sections.berlinTaxModel}</div>
        <div className="grid gap-4 lg:grid-cols-2">
          <NumberField label={copy.fields.marginalIncomeTax} value={form.rentalMarginalIncomeTaxPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalMarginalIncomeTaxPct: value }))} />
          <NumberField label={copy.fields.solidarity} value={form.rentalSolidarityPctOnIncomeTax} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalSolidarityPctOnIncomeTax: value }))} />
          <NumberField label={copy.fields.churchTax} value={form.rentalChurchTaxPctOnIncomeTax} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalChurchTaxPctOnIncomeTax: value }))} />
          <NumberField label={copy.fields.depreciation} hint={copy.fields.depreciationHint} value={form.rentalDepreciationAnnualPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalDepreciationAnnualPct: value }))} />
          <NumberField label={copy.fields.buildingShare} hint={copy.fields.buildingShareHint} value={form.rentalBuildingSharePct} step={1} onChange={(value) => setForm((previous) => ({ ...previous, rentalBuildingSharePct: value }))} />
          <NumberField label={copy.fields.transferTax} value={form.rentalTransferTaxPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalTransferTaxPct: value }))} />
          <NumberField label={copy.fields.notaryAndRegistry} value={form.rentalNotaryAndRegistryPct} step={0.1} onChange={(value) => setForm((previous) => ({ ...previous, rentalNotaryAndRegistryPct: value }))} />
          <NumberField label={copy.fields.agentFee} value={form.rentalAgentPct} step={0.01} onChange={(value) => setForm((previous) => ({ ...previous, rentalAgentPct: value }))} />
          <NumberField label={copy.fields.otherOneTimeCosts} value={form.rentalOtherFixed} step={1000} onChange={(value) => setForm((previous) => ({ ...previous, rentalOtherFixed: value }))} />
        </div>
      </div>

      {compact ? null : <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{copy.fields.rentalTaxHint}</div>}
    </div>
  )
}

function ResultsSection(props: {
  form: FormState
  rows: ReadonlyArray<ResultRow>
  copy: Translation
  selectedStrategyKey: StrategyKey
  onSelectStrategy: (key: StrategyKey) => void
}) {
  const { form, rows, copy, selectedStrategyKey, onSelectStrategy } = props
  return (
    <Section label={copy.results.label} hint={copy.results.hint}>
      <div className="mb-3 text-xs text-slate-500">{copy.results.clickHint}</div>
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((row) => (
          <button
            key={row.key}
            type="button"
            onClick={() => onSelectStrategy(row.key)}
            className={[
              'rounded-3xl border bg-white p-4 text-left shadow-sm transition',
              selectedStrategyKey === row.key ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-400',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color }}></span>
              <div className="text-sm font-semibold text-slate-900">{row.label}</div>
            </div>
            <div className="mt-4 text-2xl font-semibold text-slate-950">{formatMoney(row.summary.finalNetWorth, form.currencySymbol)}</div>
            <div className="mt-1 text-xs text-slate-600">
              {row.key === 'rentInvest' ? copy.results.baseline : copy.results.vsBaseline(formatSignedMoney(row.baselineDelta, form.currencySymbol))}
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.results.monthlyInvestableNow}</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{formatSignedMoney(row.summary.currentMonthlyContribution, form.currencySymbol)}</div>
            </div>
            <div className="mt-3 text-xs text-slate-600">
              {copy.results.breakEvenVsRent}{' '}
              {row.summary.breakEvenMonthVsRent == null ? copy.results.noBreakEven : copy.results.breakEvenValue(row.summary.breakEvenMonthVsRent, formatMonthAsYears(row.summary.breakEvenMonthVsRent))}
            </div>
          </button>
        ))}
      </div>
    </Section>
  )
}

function ScenarioCompareSection(props: { form: FormState; snapshots: Snapshot[]; copy: Translation }) {
  if (props.snapshots.length === 0) {
    return null
  }

  return (
    <Section label={props.copy.scenarios.label} hint={props.copy.scenarios.hint}>
      <div className="grid gap-3 lg:grid-cols-3">
        {props.snapshots.map((snapshot) => (
          <div key={snapshot.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{props.copy.scenarios.scenarioLabel(snapshot.id)}</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <CompareRow label={props.copy.strategyLabels.rentInvest} value={formatMoney(snapshot.summaries.rentInvest.finalNetWorth, props.form.currencySymbol)} />
              <CompareRow label={props.copy.strategyLabels.buyToLive} value={formatMoney(snapshot.summaries.buyToLive.finalNetWorth, props.form.currencySymbol)} />
              <CompareRow label={props.copy.strategyLabels.rentThenBuy} value={formatMoney(snapshot.summaries.rentThenBuy.finalNetWorth, props.form.currencySymbol)} />
              <CompareRow label={props.copy.strategyLabels.rentPlusBuyToLet} value={formatMoney(snapshot.summaries.rentPlusBuyToLet.finalNetWorth, props.form.currencySymbol)} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function CompareRow(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{props.label}</span>
      <span className="font-semibold text-slate-950">{props.value}</span>
    </div>
  )
}

function Warnings(props: { sim: ReturnType<typeof simulate>; copy: Translation; locale: Locale }) {
  const rows = [
    { label: props.copy.strategyLabels.rentInvest, warnings: props.sim.summaries.rentInvest.warnings },
    { label: props.copy.strategyLabels.buyToLive, warnings: props.sim.summaries.buyToLive.warnings },
    { label: props.copy.strategyLabels.rentThenBuy, warnings: props.sim.summaries.rentThenBuy.warnings },
    { label: props.copy.strategyLabels.rentPlusBuyToLet, warnings: props.sim.summaries.rentPlusBuyToLet.warnings },
  ]

  const visibleRows = rows.filter((row) => row.warnings.length > 0)
  if (visibleRows.length === 0) {
    return null
  }

  return (
    <Section label={props.copy.warnings.label} hint={props.copy.warnings.hint}>
      {visibleRows.map((row) => (
        <div key={row.label} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm font-semibold text-amber-950">{row.label}</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {row.warnings.map((warning) => (
              <li key={warning}>{translateSimulationWarning(props.locale, warning)}</li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  )
}

function formatSignedMoney(value: number, currencySymbol: string): string {
  const absolute = formatMoney(Math.abs(value), currencySymbol)
  if (value === 0) {
    return absolute
  }
  return `${value > 0 ? '+' : '−'}${absolute}`
}

export default App
