import { describe, expect, it } from 'vitest'
import { simulate } from './simulate'

describe('simulate', () => {
  it('produces a time series with horizonMonths + 1 points', () => {
    const result = simulate({
      horizonYears: 1,
      initialCash: 100_000,
      annualNetIncome: 72_000,
      monthlyNonHousingCosts: 1_200,
      investmentReturnAnnualPct: 0,
      salaryGrowthAnnualPct: 0,
      inflationAnnualPct: 0,
      buyAfterYears: 2,
      livingRent: { monthlyRent: 1000, growthAnnualPct: 0 },
      buyToLive: {
        price: 200_000,
        downPaymentPct: 20,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: true,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetProperty: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetRentalIncome: {
        monthlyColdRent: 0,
        growthAnnualPct: 0,
        vacancyPct: 0,
        nonRecoverableMonthlyCosts: 0,
        managementFeePct: 0,
      },
      buyToLetTaxes: {
        marginalIncomeTaxPct: 42,
        solidarityPctOnIncomeTax: 5.5,
        churchTaxPctOnIncomeTax: 0,
        depreciationAnnualPct: 2,
        buildingSharePct: 80,
      },
    })

    expect(result.points).toHaveLength(12 + 1)
    expect(result.points[0].monthIndex).toBe(0)
    expect(result.points.at(-1)?.monthIndex).toBe(12)
  })

  it('delayed buy strategy starts as renter and later gains home equity when purchase is feasible', () => {
    const result = simulate({
      horizonYears: 5,
      initialCash: 120_000,
      annualNetIncome: 84_000,
      monthlyNonHousingCosts: 1_200,
      investmentReturnAnnualPct: 0,
      salaryGrowthAnnualPct: 0,
      inflationAnnualPct: 0,
      buyAfterYears: 1,
      livingRent: { monthlyRent: 1500, growthAnnualPct: 0 },
      buyToLive: {
        price: 300_000,
        downPaymentPct: 20,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: true,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetProperty: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetRentalIncome: {
        monthlyColdRent: 0,
        growthAnnualPct: 0,
        vacancyPct: 0,
        nonRecoverableMonthlyCosts: 0,
        managementFeePct: 0,
      },
      buyToLetTaxes: {
        marginalIncomeTaxPct: 42,
        solidarityPctOnIncomeTax: 5.5,
        churchTaxPctOnIncomeTax: 0,
        depreciationAnnualPct: 2,
        buildingSharePct: 80,
      },
    })

    expect(result.points[0].rentThenBuy).toBe(120_000)
    expect(result.points[24].rentThenBuy).toBeGreaterThan(result.points[0].rentThenBuy)
    expect(result.summaries.rentThenBuy.warnings).toHaveLength(0)
  })

  it('uses an explicit monthly net income override when provided', () => {
    const result = simulate({
      horizonYears: 1,
      initialCash: 0,
      annualNetIncome: 12_000,
      monthlyNetIncome: 5_000,
      monthlyNonHousingCosts: 1_000,
      investmentReturnAnnualPct: 0,
      salaryGrowthAnnualPct: 0,
      inflationAnnualPct: 0,
      buyAfterYears: 1,
      livingRent: { monthlyRent: 0, growthAnnualPct: 0 },
      buyToLive: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetProperty: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetRentalIncome: {
        monthlyColdRent: 0,
        growthAnnualPct: 0,
        vacancyPct: 0,
        nonRecoverableMonthlyCosts: 0,
        managementFeePct: 0,
      },
      buyToLetTaxes: {
        marginalIncomeTaxPct: 42,
        solidarityPctOnIncomeTax: 5.5,
        churchTaxPctOnIncomeTax: 0,
        depreciationAnnualPct: 2,
        buildingSharePct: 80,
      },
    })

    expect(result.summaries.rentInvest.currentMonthlyContribution).toBe(4_000)
  })

  it('treats the buy-to-let strategy as buying the investment flat immediately', () => {
    const result = simulate({
      horizonYears: 1,
      initialCash: 100_000,
      annualNetIncome: 72_000,
      monthlyNonHousingCosts: 1_000,
      investmentReturnAnnualPct: 0,
      salaryGrowthAnnualPct: 0,
      inflationAnnualPct: 0,
      buyAfterYears: 2,
      livingRent: { monthlyRent: 1_500, growthAnnualPct: 0 },
      buyToLive: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetProperty: {
        price: 80_000,
        downPaymentPct: 100,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetRentalIncome: {
        monthlyColdRent: 500,
        growthAnnualPct: 0,
        vacancyPct: 0,
        nonRecoverableMonthlyCosts: 0,
        managementFeePct: 0,
      },
      buyToLetTaxes: {
        marginalIncomeTaxPct: 0,
        solidarityPctOnIncomeTax: 0,
        churchTaxPctOnIncomeTax: 0,
        depreciationAnnualPct: 0,
        buildingSharePct: 80,
      },
    })

    expect(result.points[0].rentPlusBuyToLet).toBe(100_000)
    expect(result.summaries.rentPlusBuyToLet.currentMonthlyPayment).toBe(1_000)
  })

  it('lets salary growth outrun inflation when projecting future surplus', () => {
    const baseInputs = {
      horizonYears: 2,
      initialCash: 0,
      annualNetIncome: 60_000,
      monthlyNonHousingCosts: 1_000,
      investmentReturnAnnualPct: 0,
      buyAfterYears: 10,
      livingRent: { monthlyRent: 1_000, growthAnnualPct: 0 },
      buyToLive: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetProperty: {
        price: 0,
        downPaymentPct: 0,
        growthAnnualPct: 0,
        purchaseCosts: {
          transferTaxPct: 0,
          notaryAndRegistryPct: 0,
          agentPct: 0,
          otherFixed: 0,
        },
        mortgage: {
          enabled: false,
          interestAnnualPct: 0,
          termYears: 30,
          specialRepaymentAnnualPct: 0,
          useSurplusForPrepayment: false,
        },
        maintenanceAnnualPct: 0,
        fixedMonthlyCosts: 0,
      },
      buyToLetRentalIncome: {
        monthlyColdRent: 0,
        growthAnnualPct: 0,
        vacancyPct: 0,
        nonRecoverableMonthlyCosts: 0,
        managementFeePct: 0,
      },
      buyToLetTaxes: {
        marginalIncomeTaxPct: 0,
        solidarityPctOnIncomeTax: 0,
        churchTaxPctOnIncomeTax: 0,
        depreciationAnnualPct: 0,
        buildingSharePct: 80,
      },
    }

    const withoutGrowth = simulate({
      ...baseInputs,
      salaryGrowthAnnualPct: 0,
      inflationAnnualPct: 0,
    })
    const withGrowth = simulate({
      ...baseInputs,
      salaryGrowthAnnualPct: 5,
      inflationAnnualPct: 2,
    })

    expect(withGrowth.summaries.rentInvest.finalNetWorth).toBeGreaterThan(
      withoutGrowth.summaries.rentInvest.finalNetWorth,
    )
  })
})
