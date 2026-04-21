export type StrategyKey =
  | 'rentInvest'
  | 'buyToLive'
  | 'rentThenBuy'
  | 'rentPlusBuyToLet'

export type PurchaseCosts = {
  transferTaxPct: number
  notaryAndRegistryPct: number
  agentPct: number
  otherFixed: number
}

export type Mortgage = {
  enabled: boolean
  interestAnnualPct: number
  termYears: number
  specialRepaymentAnnualPct: number
  useSurplusForPrepayment: boolean
}

export type Property = {
  price: number
  downPaymentPct: number
  growthAnnualPct: number
  purchaseCosts: PurchaseCosts
  mortgage: Mortgage
  maintenanceAnnualPct: number
  fixedMonthlyCosts: number
}

export type Rent = {
  monthlyRent: number
  growthAnnualPct: number
}

export type RentalIncome = {
  monthlyColdRent: number
  growthAnnualPct: number
  vacancyPct: number
  nonRecoverableMonthlyCosts: number
  managementFeePct: number
}

export type BuyToLetTaxes = {
  marginalIncomeTaxPct: number
  solidarityPctOnIncomeTax: number
  churchTaxPctOnIncomeTax: number
  depreciationAnnualPct: number
  buildingSharePct: number
}

export type Inputs = {
  horizonYears: number
  initialCash: number
  annualNetIncome: number
  monthlyNetIncome?: number
  monthlyNonHousingCosts: number
  investmentReturnAnnualPct: number
  salaryGrowthAnnualPct: number
  inflationAnnualPct: number
  buyAfterYears: number
  livingRent: Rent
  buyToLive: Property
  buyToLetProperty: Property
  buyToLetRentalIncome: RentalIncome
  buyToLetTaxes: BuyToLetTaxes
}

export type SeriesPoint = {
  monthIndex: number
  year: number
  rentInvest: number
  buyToLive: number
  rentThenBuy: number
  rentPlusBuyToLet: number
  buyToLiveMortgageBalance: number
  rentThenBuyMortgageBalance: number
  buyToLetMortgageBalance: number
  rentMonthlyPayment: number
  buyToLiveMonthlyPayment: number
  rentThenBuyMonthlyPayment: number
  buyToLetMonthlyPayment: number
}

export type StrategySummary = {
  finalNetWorth: number
  breakEvenMonthVsRent: number | null
  currentMonthlyContribution: number
  currentMonthlyPayment: number
  currentMonthlyMortgagePayment: number
  currentMonthlyExtraRepayment: number
  warnings: string[]
}

export type SimulationResult = {
  points: SeriesPoint[]
  summaries: Record<StrategyKey, StrategySummary>
}

type MortgageState = {
  balance: number
  monthlyPayment: number
  monthlyRate: number
  initialPrincipal: number
  annualSpecialRepaymentCap: number
  specialRepaidThisYear: number
}

type AmortizationStep = {
  next: MortgageState
  principalPaid: number
  interestPaid: number
}

function clampNumber(value: number): number {
  if (!Number.isFinite(value)) return 0
  return value
}

function monthlyRateFromAnnualPct(annualPct: number): number {
  const annualRate = clampNumber(annualPct) / 100
  return Math.pow(1 + annualRate, 1 / 12) - 1
}

function upfrontCosts(price: number, costs: PurchaseCosts): number {
  const safePrice = clampNumber(price)
  const pctSum =
    clampNumber(costs.transferTaxPct) +
    clampNumber(costs.notaryAndRegistryPct) +
    clampNumber(costs.agentPct)
  return safePrice * (pctSum / 100) + clampNumber(costs.otherFixed)
}

function downPaymentAmount(price: number, downPaymentPct: number): number {
  return clampNumber(price) * (clampNumber(downPaymentPct) / 100)
}

function upfrontCashRequired(property: Property, purchasePrice: number): number {
  const equityCash = property.mortgage.enabled
    ? downPaymentAmount(purchasePrice, property.downPaymentPct)
    : clampNumber(purchasePrice)
  return equityCash + upfrontCosts(purchasePrice, property.purchaseCosts)
}

function annuityMonthlyPayment(
  principal: number,
  interestAnnualPct: number,
  termMonths: number,
): number {
  const safePrincipal = clampNumber(principal)
  const totalMonths = Math.max(0, Math.round(termMonths))
  if (totalMonths === 0) return 0

  const monthlyRate = monthlyRateFromAnnualPct(interestAnnualPct)
  if (monthlyRate === 0) return safePrincipal / totalMonths

  const factor = Math.pow(1 + monthlyRate, totalMonths)
  return safePrincipal * ((monthlyRate * factor) / (factor - 1))
}

function createMortgageState(property: Property, purchasePrice: number): MortgageState {
  if (!property.mortgage.enabled) {
    return {
      balance: 0,
      monthlyPayment: 0,
      monthlyRate: 0,
      initialPrincipal: 0,
      annualSpecialRepaymentCap: 0,
      specialRepaidThisYear: 0,
    }
  }

  const safePrice = clampNumber(purchasePrice)
  const downPayment = downPaymentAmount(safePrice, property.downPaymentPct)
  const principal = Math.max(0, safePrice - downPayment)
  if (principal === 0) {
    return {
      balance: 0,
      monthlyPayment: 0,
      monthlyRate: 0,
      initialPrincipal: 0,
      annualSpecialRepaymentCap: 0,
      specialRepaidThisYear: 0,
    }
  }

  const termMonths = Math.max(0, Math.round(property.mortgage.termYears * 12))
  return {
    balance: principal,
    monthlyPayment: annuityMonthlyPayment(
      principal,
      property.mortgage.interestAnnualPct,
      termMonths,
    ),
    monthlyRate: monthlyRateFromAnnualPct(property.mortgage.interestAnnualPct),
    initialPrincipal: principal,
    annualSpecialRepaymentCap:
      principal * Math.min(5, Math.max(0, property.mortgage.specialRepaymentAnnualPct)) / 100,
    specialRepaidThisYear: 0,
  }
}

function amortizeOneMonth(mortgage: MortgageState): AmortizationStep {
  if (mortgage.balance <= 0 || mortgage.monthlyPayment <= 0) {
    return {
      next: { ...mortgage, balance: 0 },
      principalPaid: 0,
      interestPaid: 0,
    }
  }

  const interestPaid = mortgage.balance * mortgage.monthlyRate
  const scheduledPrincipal = mortgage.monthlyPayment - interestPaid
  const principalPaid = Math.max(0, Math.min(mortgage.balance, scheduledPrincipal))
  return {
    next: {
      ...mortgage,
      balance: mortgage.balance - principalPaid,
    },
    principalPaid,
    interestPaid,
  }
}

function applyExtraRepayment(
  mortgage: MortgageState,
  requestedAmount: number,
  countTowardsSpecialCap: boolean,
): {
  next: MortgageState
  appliedAmount: number
} {
  if (mortgage.balance <= 0) {
    return { next: mortgage, appliedAmount: 0 }
  }

  const appliedAmount = Math.max(0, Math.min(mortgage.balance, requestedAmount))
  if (appliedAmount === 0) {
    return { next: mortgage, appliedAmount: 0 }
  }

  return {
    next: {
      ...mortgage,
      balance: mortgage.balance - appliedAmount,
      specialRepaidThisYear: countTowardsSpecialCap
        ? mortgage.specialRepaidThisYear + appliedAmount
        : mortgage.specialRepaidThisYear,
    },
    appliedAmount,
  }
}

function resetAnnualSpecialRepaymentCounterIfNeeded(mortgage: MortgageState, monthIndex: number): MortgageState {
  if (monthIndex > 0 && monthIndex % 12 === 0) {
    return { ...mortgage, specialRepaidThisYear: 0 }
  }
  return mortgage
}

function availableAnnualSpecialRepayment(mortgage: MortgageState): number {
  return Math.max(0, mortgage.annualSpecialRepaymentCap - mortgage.specialRepaidThisYear)
}

function propertyValueAtMonth(price: number, growthAnnualPct: number, monthIndex: number): number {
  const monthlyGrowth = monthlyRateFromAnnualPct(growthAnnualPct)
  return clampNumber(price) * Math.pow(1 + monthlyGrowth, monthIndex)
}

function rentAtMonth(rent: Rent, monthIndex: number): number {
  const monthlyGrowth = monthlyRateFromAnnualPct(rent.growthAnnualPct)
  return clampNumber(rent.monthlyRent) * Math.pow(1 + monthlyGrowth, monthIndex)
}

function rentalColdRentAtMonth(rental: RentalIncome, monthIndex: number): number {
  const monthlyGrowth = monthlyRateFromAnnualPct(rental.growthAnnualPct)
  return clampNumber(rental.monthlyColdRent) * Math.pow(1 + monthlyGrowth, monthIndex)
}

function valueAtMonth(amount: number, annualPct: number, monthIndex: number): number {
  const monthlyGrowth = monthlyRateFromAnnualPct(annualPct)
  return clampNumber(amount) * Math.pow(1 + monthlyGrowth, monthIndex)
}

function effectiveRentalTaxRate(taxes: BuyToLetTaxes): number {
  const incomeTax = clampNumber(taxes.marginalIncomeTaxPct) / 100
  const solidarity = clampNumber(taxes.solidarityPctOnIncomeTax) / 100
  const church = clampNumber(taxes.churchTaxPctOnIncomeTax) / 100
  return incomeTax * (1 + solidarity + church)
}

function baseMonthlyNetIncome(inputs: Inputs): number {
  return typeof inputs.monthlyNetIncome === 'number'
    ? clampNumber(inputs.monthlyNetIncome)
    : clampNumber(inputs.annualNetIncome) / 12
}

function monthlyNetIncomeAtMonth(inputs: Inputs, monthIndex: number): number {
  return valueAtMonth(baseMonthlyNetIncome(inputs), inputs.salaryGrowthAnnualPct, monthIndex)
}

function monthlyNonHousingCostsAtMonth(inputs: Inputs, monthIndex: number): number {
  return valueAtMonth(inputs.monthlyNonHousingCosts, inputs.inflationAnnualPct, monthIndex)
}

function monthlyDisposableBeforeHousing(inputs: Inputs, monthIndex: number): number {
  return monthlyNetIncomeAtMonth(inputs, monthIndex) - monthlyNonHousingCostsAtMonth(inputs, monthIndex)
}

export function simulate(rawInputs: Inputs): SimulationResult {
  const inputs: Inputs = {
    ...rawInputs,
    horizonYears: Math.max(0, clampNumber(rawInputs.horizonYears)),
    buyAfterYears: Math.max(0, clampNumber(rawInputs.buyAfterYears)),
  }

  const months = Math.round(inputs.horizonYears * 12)
  const buyAfterMonths = Math.round(inputs.buyAfterYears * 12)
  const investMonthlyRate = monthlyRateFromAnnualPct(inputs.investmentReturnAnnualPct)
  const disposableBeforeHousing = monthlyDisposableBeforeHousing(inputs, 0)
  const rentalTaxRate = effectiveRentalTaxRate(inputs.buyToLetTaxes)

  const warningsRent: string[] = []
  const warningsBuyLive: string[] = []
  const warningsRentThenBuy: string[] = []
  const warningsBuyLet: string[] = []

  let rentInvestBalance = clampNumber(inputs.initialCash)
  let buyLiveBalance = clampNumber(inputs.initialCash) - upfrontCashRequired(inputs.buyToLive, inputs.buyToLive.price)
  let rentThenBuyBalance = clampNumber(inputs.initialCash)
  let buyLetBalance =
    clampNumber(inputs.initialCash) - upfrontCashRequired(inputs.buyToLetProperty, inputs.buyToLetProperty.price)

  if (buyLiveBalance < 0) {
    warningsBuyLive.push('Upfront cash needed to buy the home now exceeds initial cash.')
  }
  if (buyLetBalance < 0) {
    warningsBuyLet.push('Upfront cash needed for the rental property exceeds initial cash.')
  }

  let homeMortgage = createMortgageState(inputs.buyToLive, inputs.buyToLive.price)
  let delayedHomeMortgage: MortgageState = {
    balance: 0,
    monthlyPayment: 0,
    monthlyRate: 0,
    initialPrincipal: 0,
    annualSpecialRepaymentCap: 0,
    specialRepaidThisYear: 0,
  }
  let rentalMortgage = createMortgageState(inputs.buyToLetProperty, inputs.buyToLetProperty.price)
  let rentThenBuyPurchased = false

  if (buyAfterMonths === 0) {
    rentThenBuyBalance -= upfrontCashRequired(inputs.buyToLive, inputs.buyToLive.price)
    delayedHomeMortgage = createMortgageState(inputs.buyToLive, inputs.buyToLive.price)
    rentThenBuyPurchased = true

    if (rentThenBuyBalance < 0) {
      warningsRentThenBuy.push('Upfront cash needed for the delayed-buy strategy exceeds initial cash.')
    }
  }

  const currentLivingRent = rentAtMonth(inputs.livingRent, 0)
  const currentHomeValue = propertyValueAtMonth(inputs.buyToLive.price, inputs.buyToLive.growthAnnualPct, 0)
  const currentBuyLiveOwnerCosts =
    (clampNumber(inputs.buyToLive.maintenanceAnnualPct) / 100) * (currentHomeValue / 12) +
    clampNumber(inputs.buyToLive.fixedMonthlyCosts)
  const currentBuyLiveBasePayment = homeMortgage.monthlyPayment + currentBuyLiveOwnerCosts
  const currentBuyLiveRawContribution = disposableBeforeHousing - currentBuyLiveBasePayment
  const currentBuyLiveExtraRepayment =
    inputs.buyToLive.mortgage.useSurplusForPrepayment && currentBuyLiveRawContribution > 0
      ? Math.min(currentBuyLiveRawContribution, homeMortgage.balance)
      : 0
  const currentBuyLiveContribution = currentBuyLiveRawContribution - currentBuyLiveExtraRepayment

  const currentRentalValue = propertyValueAtMonth(inputs.buyToLetProperty.price, inputs.buyToLetProperty.growthAnnualPct, 0)
  const currentRentalGross = rentalColdRentAtMonth(inputs.buyToLetRentalIncome, 0)
  const currentEffectiveRent =
    currentRentalGross * Math.max(0, 1 - clampNumber(inputs.buyToLetRentalIncome.vacancyPct) / 100)
  const currentManagementFee =
    (clampNumber(inputs.buyToLetRentalIncome.managementFeePct) / 100) * currentEffectiveRent
  const currentRentalOwnerCosts =
    (clampNumber(inputs.buyToLetProperty.maintenanceAnnualPct) / 100) * (currentRentalValue / 12) +
    clampNumber(inputs.buyToLetProperty.fixedMonthlyCosts) +
    clampNumber(inputs.buyToLetRentalIncome.nonRecoverableMonthlyCosts) +
    currentManagementFee
  const currentRentalInterest = rentalMortgage.balance * rentalMortgage.monthlyRate
  const currentDepreciation =
    (clampNumber(inputs.buyToLetProperty.price) *
      (clampNumber(inputs.buyToLetTaxes.buildingSharePct) / 100) *
      (clampNumber(inputs.buyToLetTaxes.depreciationAnnualPct) / 100)) /
    12
  const currentTaxableRentalProfit =
    currentEffectiveRent - currentRentalOwnerCosts - currentRentalInterest - currentDepreciation
  const currentRentalTaxes = currentTaxableRentalProfit * rentalTaxRate
  const currentRentalCashflow =
    currentEffectiveRent - (rentalMortgage.monthlyPayment + currentRentalOwnerCosts) - currentRentalTaxes
  const currentRentPayment = currentLivingRent
  const currentHomeScheduledPayment = homeMortgage.monthlyPayment
  const currentBuyLetBasePayment = currentLivingRent + rentalMortgage.monthlyPayment + currentRentalOwnerCosts - currentEffectiveRent + currentRentalTaxes
  const currentBuyLetExtraRepayment =
    inputs.buyToLetProperty.mortgage.useSurplusForPrepayment &&
    disposableBeforeHousing - currentBuyLetBasePayment > 0
      ? Math.min(disposableBeforeHousing - currentBuyLetBasePayment, rentalMortgage.balance)
      : 0
  const currentDelayedExtraRepayment =
    inputs.buyToLive.mortgage.useSurplusForPrepayment && buyAfterMonths === 0 && currentBuyLiveRawContribution > 0
      ? Math.min(currentBuyLiveRawContribution, delayedHomeMortgage.balance)
      : 0
  const currentDelayedContribution =
    buyAfterMonths === 0
      ? currentBuyLiveRawContribution - currentDelayedExtraRepayment
      : disposableBeforeHousing - currentLivingRent
  const currentDelayedScheduledPayment = delayedHomeMortgage.monthlyPayment
  const currentRentalScheduledPayment = rentalMortgage.monthlyPayment

  let rentWarningRaised = false
  let buyLiveWarningRaised = false
  let rentThenBuyWarningRaised = false
  let buyLetWarningRaised = false

  const points: SeriesPoint[] = []

  for (let monthIndex = 0; monthIndex <= months; monthIndex++) {
    homeMortgage = resetAnnualSpecialRepaymentCounterIfNeeded(homeMortgage, monthIndex)
    delayedHomeMortgage = resetAnnualSpecialRepaymentCounterIfNeeded(delayedHomeMortgage, monthIndex)
    rentalMortgage = resetAnnualSpecialRepaymentCounterIfNeeded(rentalMortgage, monthIndex)

    const disposableBeforeHousingAtMonth = monthlyDisposableBeforeHousing(inputs, monthIndex)
    const livingRent = rentAtMonth(inputs.livingRent, monthIndex)
    const homeValue = propertyValueAtMonth(inputs.buyToLive.price, inputs.buyToLive.growthAnnualPct, monthIndex)
    const rentalValue = propertyValueAtMonth(
      inputs.buyToLetProperty.price,
      inputs.buyToLetProperty.growthAnnualPct,
      monthIndex,
    )
    const buyLiveFixedMonthlyCosts = valueAtMonth(
      inputs.buyToLive.fixedMonthlyCosts,
      inputs.inflationAnnualPct,
      monthIndex,
    )
    const rentalFixedMonthlyCosts = valueAtMonth(
      inputs.buyToLetProperty.fixedMonthlyCosts,
      inputs.inflationAnnualPct,
      monthIndex,
    )
    const rentalNonRecoverableMonthlyCosts = valueAtMonth(
      inputs.buyToLetRentalIncome.nonRecoverableMonthlyCosts,
      inputs.inflationAnnualPct,
      monthIndex,
    )

    const buyLiveOwnerCosts =
      (clampNumber(inputs.buyToLive.maintenanceAnnualPct) / 100) * (homeValue / 12) +
      buyLiveFixedMonthlyCosts
    const buyLiveBasePayment = homeMortgage.monthlyPayment + buyLiveOwnerCosts
    const buyLiveRawContribution = disposableBeforeHousingAtMonth - buyLiveBasePayment
    let buyLiveExtraRepayment = 0
    if (inputs.buyToLive.mortgage.useSurplusForPrepayment && buyLiveRawContribution > 0) {
      const extra = applyExtraRepayment(homeMortgage, buyLiveRawContribution, false)
      homeMortgage = extra.next
      buyLiveExtraRepayment = extra.appliedAmount
    }
    const buyLiveContribution = buyLiveRawContribution - buyLiveExtraRepayment

    const delayedOwnerCosts =
      (clampNumber(inputs.buyToLive.maintenanceAnnualPct) / 100) * (homeValue / 12) +
      buyLiveFixedMonthlyCosts
    const delayedBasePayment = delayedHomeMortgage.monthlyPayment + delayedOwnerCosts
    const delayedRawContribution = rentThenBuyPurchased
      ? disposableBeforeHousingAtMonth - delayedBasePayment
      : disposableBeforeHousingAtMonth - livingRent
    let delayedExtraRepayment = 0
    if (
      rentThenBuyPurchased &&
      inputs.buyToLive.mortgage.useSurplusForPrepayment &&
      delayedRawContribution > 0
    ) {
      const extra = applyExtraRepayment(delayedHomeMortgage, delayedRawContribution, false)
      delayedHomeMortgage = extra.next
      delayedExtraRepayment = extra.appliedAmount
    }
    const rentThenBuyContribution = delayedRawContribution - delayedExtraRepayment

    const rentalGross = rentalColdRentAtMonth(inputs.buyToLetRentalIncome, monthIndex)
    const rentalEffective = rentalGross * Math.max(0, 1 - clampNumber(inputs.buyToLetRentalIncome.vacancyPct) / 100)
    const rentalManagementFee =
      (clampNumber(inputs.buyToLetRentalIncome.managementFeePct) / 100) * rentalEffective
    const rentalOwnerCosts =
      (clampNumber(inputs.buyToLetProperty.maintenanceAnnualPct) / 100) * (rentalValue / 12) +
      rentalFixedMonthlyCosts +
      rentalNonRecoverableMonthlyCosts +
      rentalManagementFee
    const rentalAmortization = amortizeOneMonth(rentalMortgage)
    const monthlyDepreciation =
      (clampNumber(inputs.buyToLetProperty.price) *
        (clampNumber(inputs.buyToLetTaxes.buildingSharePct) / 100) *
        (clampNumber(inputs.buyToLetTaxes.depreciationAnnualPct) / 100)) /
      12
    const taxableRentalProfit =
      rentalEffective - rentalOwnerCosts - rentalAmortization.interestPaid - monthlyDepreciation
    const rentalTaxes = taxableRentalProfit * rentalTaxRate
    const rentalNetCashflow =
      rentalEffective - (rentalMortgage.monthlyPayment + rentalOwnerCosts) - rentalTaxes

    const rentContribution = disposableBeforeHousingAtMonth - livingRent
    const buyLetRawContribution = rentContribution + rentalNetCashflow
    let buyLetExtraRepayment = 0
    if (inputs.buyToLetProperty.mortgage.useSurplusForPrepayment && buyLetRawContribution > 0) {
      const extra = applyExtraRepayment(rentalMortgage, buyLetRawContribution, false)
      rentalMortgage = extra.next
      buyLetExtraRepayment = extra.appliedAmount
    }
    const buyLetContribution = buyLetRawContribution - buyLetExtraRepayment

    points.push({
      monthIndex,
      year: monthIndex / 12,
      rentInvest: rentInvestBalance,
      buyToLive: buyLiveBalance + (homeValue - homeMortgage.balance),
      rentThenBuy: rentThenBuyPurchased
        ? rentThenBuyBalance + (homeValue - delayedHomeMortgage.balance)
        : rentThenBuyBalance,
      rentPlusBuyToLet: buyLetBalance + (rentalValue - rentalMortgage.balance),
      buyToLiveMortgageBalance: homeMortgage.balance,
      rentThenBuyMortgageBalance: delayedHomeMortgage.balance,
      buyToLetMortgageBalance: rentalMortgage.balance,
      rentMonthlyPayment: livingRent,
      buyToLiveMonthlyPayment: buyLiveBasePayment + buyLiveExtraRepayment,
      rentThenBuyMonthlyPayment: rentThenBuyPurchased
        ? delayedBasePayment + delayedExtraRepayment
        : livingRent,
      buyToLetMonthlyPayment:
        livingRent + rentalMortgage.monthlyPayment + rentalOwnerCosts - rentalEffective + rentalTaxes + buyLetExtraRepayment,
    })

    if (monthIndex === months) {
      break
    }

    rentInvestBalance = rentInvestBalance * (1 + investMonthlyRate) + rentContribution
    buyLiveBalance = buyLiveBalance * (1 + investMonthlyRate) + buyLiveContribution
    rentThenBuyBalance = rentThenBuyBalance * (1 + investMonthlyRate) + rentThenBuyContribution
    buyLetBalance = buyLetBalance * (1 + investMonthlyRate) + buyLetContribution

    if ((monthIndex + 1) % 12 === 0) {
      const buyLiveSpecial = Math.max(0, Math.min(buyLiveBalance, availableAnnualSpecialRepayment(homeMortgage)))
      if (buyLiveSpecial > 0) {
        const extra = applyExtraRepayment(homeMortgage, buyLiveSpecial, true)
        homeMortgage = extra.next
        buyLiveBalance -= extra.appliedAmount
      }

      if (rentThenBuyPurchased) {
        const delayedSpecial = Math.max(0, Math.min(
          rentThenBuyBalance,
          availableAnnualSpecialRepayment(delayedHomeMortgage),
        ))
        if (delayedSpecial > 0) {
          const extra = applyExtraRepayment(delayedHomeMortgage, delayedSpecial, true)
          delayedHomeMortgage = extra.next
          rentThenBuyBalance -= extra.appliedAmount
        }
      }

      const buyLetSpecial = Math.max(0, Math.min(buyLetBalance, availableAnnualSpecialRepayment(rentalMortgage)))
      if (buyLetSpecial > 0) {
        const extra = applyExtraRepayment(rentalMortgage, buyLetSpecial, true)
        rentalMortgage = extra.next
        buyLetBalance -= extra.appliedAmount
      }
    }

    if (rentInvestBalance < 0 && !rentWarningRaised) {
      warningsRent.push('Monthly budget goes negative under rent + invest assumptions.')
      rentWarningRaised = true
    }
    if (buyLiveBalance < 0 && !buyLiveWarningRaised) {
      warningsBuyLive.push('Monthly budget goes negative under buy-now assumptions.')
      buyLiveWarningRaised = true
    }
    if (rentThenBuyBalance < 0 && !rentThenBuyWarningRaised) {
      warningsRentThenBuy.push('Monthly budget goes negative under rent-then-buy assumptions.')
      rentThenBuyWarningRaised = true
    }
    if (buyLetBalance < 0 && !buyLetWarningRaised) {
      warningsBuyLet.push('Monthly budget goes negative under buy-to-let assumptions.')
      buyLetWarningRaised = true
    }

    const nextMonthIndex = monthIndex + 1
    if (!rentThenBuyPurchased && nextMonthIndex === buyAfterMonths) {
      const delayedPurchasePrice = propertyValueAtMonth(
        inputs.buyToLive.price,
        inputs.buyToLive.growthAnnualPct,
        nextMonthIndex,
      )
      const delayedUpfront = upfrontCashRequired(inputs.buyToLive, delayedPurchasePrice)

      if (rentThenBuyBalance >= delayedUpfront) {
        rentThenBuyBalance -= delayedUpfront
        delayedHomeMortgage = createMortgageState(inputs.buyToLive, delayedPurchasePrice)
        rentThenBuyPurchased = true
      } else {
        warningsRentThenBuy.push(
          `At month ${nextMonthIndex}, saved cash is not enough to buy the home, so this strategy keeps renting.`,
        )
      }
    }

    homeMortgage = amortizeOneMonth(homeMortgage).next
    delayedHomeMortgage = amortizeOneMonth(delayedHomeMortgage).next
    rentalMortgage = rentalAmortization.next
  }

  const finalPoint = points[points.length - 1]

  return {
    points,
    summaries: {
      rentInvest: {
        finalNetWorth: finalPoint?.rentInvest ?? 0,
        breakEvenMonthVsRent: null,
        currentMonthlyContribution: disposableBeforeHousing - currentLivingRent,
        currentMonthlyPayment: currentRentPayment,
        currentMonthlyMortgagePayment: 0,
        currentMonthlyExtraRepayment: 0,
        warnings: warningsRent,
      },
      buyToLive: {
        finalNetWorth: finalPoint?.buyToLive ?? 0,
        breakEvenMonthVsRent: findBreakEvenMonth(points, 'buyToLive'),
        currentMonthlyContribution: currentBuyLiveContribution,
        currentMonthlyPayment: currentBuyLiveBasePayment + currentBuyLiveExtraRepayment,
        currentMonthlyMortgagePayment: currentHomeScheduledPayment,
        currentMonthlyExtraRepayment: currentBuyLiveExtraRepayment,
        warnings: warningsBuyLive,
      },
      rentThenBuy: {
        finalNetWorth: finalPoint?.rentThenBuy ?? 0,
        breakEvenMonthVsRent: findBreakEvenMonth(points, 'rentThenBuy'),
        currentMonthlyContribution: currentDelayedContribution,
        currentMonthlyPayment:
          buyAfterMonths === 0
            ? currentBuyLiveBasePayment + currentDelayedExtraRepayment
            : currentLivingRent,
        currentMonthlyMortgagePayment: buyAfterMonths === 0 ? currentDelayedScheduledPayment : 0,
        currentMonthlyExtraRepayment: currentDelayedExtraRepayment,
        warnings: warningsRentThenBuy,
      },
      rentPlusBuyToLet: {
        finalNetWorth: finalPoint?.rentPlusBuyToLet ?? 0,
        breakEvenMonthVsRent: findBreakEvenMonth(points, 'rentPlusBuyToLet'),
        currentMonthlyContribution: disposableBeforeHousing - currentLivingRent + currentRentalCashflow,
        currentMonthlyPayment: currentBuyLetBasePayment + currentBuyLetExtraRepayment,
        currentMonthlyMortgagePayment: currentRentalScheduledPayment,
        currentMonthlyExtraRepayment: currentBuyLetExtraRepayment,
        warnings: warningsBuyLet,
      },
    },
  }
}

function findBreakEvenMonth(
  points: SeriesPoint[],
  key: 'buyToLive' | 'rentThenBuy' | 'rentPlusBuyToLet',
): number | null {
  for (const point of points) {
    if (point[key] >= point.rentInvest) {
      return point.monthIndex
    }
  }

  return null
}
