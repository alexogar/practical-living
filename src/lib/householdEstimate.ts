export type HouseholdEstimateInputs = {
  householdAdults: number
  householdChildren: number
  householdLifestylePct: number
  householdTransportMonthly: number
  householdInsuranceMonthly: number
  householdDiningMonthly: number
  householdVacationYearly: number
  householdChildcareMonthly: number
}

export type HouseholdEstimate = {
  groceries: number
  essentials: number
  transport: number
  insurance: number
  dining: number
  vacation: number
  childcare: number
  lifestyleAdjustment: number
  total: number
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0
}

export function estimateHouseholdCosts(inputs: HouseholdEstimateInputs): HouseholdEstimate {
  const adults = Math.max(0, Math.round(safeNumber(inputs.householdAdults)))
  const children = Math.max(0, Math.round(safeNumber(inputs.householdChildren)))
  const lifestylePct = Math.max(70, Math.min(150, safeNumber(inputs.householdLifestylePct)))

  const groceries = adults * 320 + children * 220
  const essentials = adults * 90 + children * 70
  const transport = Math.max(0, safeNumber(inputs.householdTransportMonthly))
  const insurance = Math.max(0, safeNumber(inputs.householdInsuranceMonthly))
  const dining = Math.max(0, safeNumber(inputs.householdDiningMonthly))
  const vacation = Math.max(0, safeNumber(inputs.householdVacationYearly)) / 12
  const childcare = Math.max(0, safeNumber(inputs.householdChildcareMonthly))

  const lifestyleBase = groceries + essentials + dining + vacation
  const lifestyleAdjustment = lifestyleBase * ((lifestylePct - 100) / 100)
  const total =
    groceries + essentials + transport + insurance + dining + vacation + childcare + lifestyleAdjustment

  return {
    groceries,
    essentials,
    transport,
    insurance,
    dining,
    vacation,
    childcare,
    lifestyleAdjustment,
    total,
  }
}