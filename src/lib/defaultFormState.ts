export type FormState = {
  currencySymbol: string
  horizonYears: number
  initialCash: number
  annualNetIncome: number
  monthlyNetIncome: number
  monthlyNetIncomeEnabled: boolean
  monthlyNonHousingCosts: number
  householdAdults: number
  householdChildren: number
  householdLifestylePct: number
  householdTransportMonthly: number
  householdInsuranceMonthly: number
  householdDiningMonthly: number
  householdVacationYearly: number
  householdChildcareMonthly: number
  investmentReturnAnnualPct: number
  buyAfterYears: number

  livingRentMonthly: number
  livingRentGrowthAnnualPct: number

  homePrice: number
  homeDownPaymentPct: number
  homeInterestAnnualPct: number
  homeTermYears: number
  homeSpecialRepaymentAnnualPct: number
  homeUseSurplusForPrepayment: boolean
  homeGrowthAnnualPct: number
  homeMaintenanceAnnualPct: number
  homeFixedMonthlyCosts: number
  homeTransferTaxPct: number
  homeNotaryAndRegistryPct: number
  homeAgentPct: number
  homeOtherFixed: number

  rentalPrice: number
  rentalDownPaymentPct: number
  rentalMortgageEnabled: boolean
  rentalInterestAnnualPct: number
  rentalTermYears: number
  rentalSpecialRepaymentAnnualPct: number
  rentalUseSurplusForPrepayment: boolean
  rentalGrowthAnnualPct: number
  rentalMaintenanceAnnualPct: number
  rentalFixedMonthlyCosts: number
  rentalTransferTaxPct: number
  rentalNotaryAndRegistryPct: number
  rentalAgentPct: number
  rentalOtherFixed: number

  rentalColdRentMonthly: number
  rentalRentGrowthAnnualPct: number
  rentalVacancyPct: number
  rentalNonRecoverableMonthlyCosts: number
  rentalManagementFeePct: number
  rentalMarginalIncomeTaxPct: number
  rentalSolidarityPctOnIncomeTax: number
  rentalChurchTaxPctOnIncomeTax: number
  rentalDepreciationAnnualPct: number
  rentalBuildingSharePct: number
}

export const defaultFormState: FormState = {
  currencySymbol: '€',
  horizonYears: 20,

  initialCash: 100_000,
  annualNetIncome: 72_000,
  monthlyNetIncome: 6_000,
  monthlyNetIncomeEnabled: false,
  monthlyNonHousingCosts: 1_200,
  householdAdults: 1,
  householdChildren: 0,
  householdLifestylePct: 100,
  householdTransportMonthly: 120,
  householdInsuranceMonthly: 180,
  householdDiningMonthly: 160,
  householdVacationYearly: 2_400,
  householdChildcareMonthly: 0,
  investmentReturnAnnualPct: 5,
  buyAfterYears: 2,

  livingRentMonthly: 1_800,
  livingRentGrowthAnnualPct: 2,

  homePrice: 500_000,
  homeDownPaymentPct: 20,
  homeInterestAnnualPct: 3.5,
  homeTermYears: 30,
  homeSpecialRepaymentAnnualPct: 0,
  homeUseSurplusForPrepayment: false,
  homeGrowthAnnualPct: 2,
  homeMaintenanceAnnualPct: 1,
  homeFixedMonthlyCosts: 0,
  // Berlin/DE-ish defaults, editable.
  homeTransferTaxPct: 6,
  homeNotaryAndRegistryPct: 1.5,
  homeAgentPct: 3.57,
  homeOtherFixed: 0,

  // Smaller buy-to-let flat.
  rentalPrice: 250_000,
  rentalDownPaymentPct: 20,
  rentalMortgageEnabled: true,
  rentalInterestAnnualPct: 3.5,
  rentalTermYears: 30,
  rentalSpecialRepaymentAnnualPct: 0,
  rentalUseSurplusForPrepayment: false,
  rentalGrowthAnnualPct: 2,
  rentalMaintenanceAnnualPct: 1,
  rentalFixedMonthlyCosts: 0,
  rentalTransferTaxPct: 6,
  rentalNotaryAndRegistryPct: 1.5,
  rentalAgentPct: 3.57,
  rentalOtherFixed: 0,

  rentalColdRentMonthly: 900,
  rentalRentGrowthAnnualPct: 2,
  rentalVacancyPct: 3,
  rentalNonRecoverableMonthlyCosts: 150,
  rentalManagementFeePct: 0,
  rentalMarginalIncomeTaxPct: 42,
  rentalSolidarityPctOnIncomeTax: 5.5,
  rentalChurchTaxPctOnIncomeTax: 0,
  rentalDepreciationAnnualPct: 2,
  rentalBuildingSharePct: 80,
}
