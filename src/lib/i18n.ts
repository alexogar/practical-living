export type Locale = 'en' | 'de'

export type StrategyLabels = {
  rentInvest: string
  buyToLive: string
  rentThenBuy: string
  rentPlusBuyToLet: string
}

export type Translation = {
  languageLabel: string
  languages: Record<Locale, string>
  header: {
    eyebrow: string
    title: string
    intro: string
  }
  summary: {
    planningLabel: string
    planningHint: string
    horizon: string
    income: string
    livingCosts: string
    cashToday: string
    editStep: string
    readOnly: string
    activeInput: string
  }
  readThis: {
    label: string
    hint: string
    finalNetWorthTitle: string
    finalNetWorthBody: string
    monthlyInvestableTitle: string
    monthlyInvestableBody: string
    breakEvenTitle: string
    breakEvenBody: string
  }
  guided: {
    label: string
    stepBadge: string
    next: string
    back: string
    advancedHint: string
    steps: Array<{
      title: string
      prompt: string
    }>
  }
  quickActions: {
    label: string
    hint: string
    saveScenario: string
    saveScenarioHint: string
    activeBadge: string
    inactiveBadge: string
    currentLabel: string
    noScenario: string
    investInstead: string
    investInsteadDescription: string
    aggressiveHome: string
    aggressiveHomeDescription: string
    aggressiveRental: string
    aggressiveRentalDescription: string
    waitLonger: string
    waitLongerDescription: string
  }
  advanced: {
    label: string
    hint: string
    money: string
    liveAndBuy: string
    buyToLet: string
  }
  sections: {
    whereYouLive: string
    buyHome: string
    rentalIncome: string
    berlinDefaults: string
    berlinTaxModel: string
  }
  estimator: {
    label: string
    hint: string
    roughModel: string
    useEstimate: string
    estimateReady: string
    groceries: string
    essentials: string
    lifestyleAdjustment: string
  }
  fields: {
    currencySymbol: string
    horizonYears: string
    annualNetIncome: string
    annualNetIncomeHint: string
    monthlyNetIncomeToggle: string
    monthlyNetIncomeToggleHint: string
    monthlyNetIncome: string
    monthlyNetIncomeHint: string
    monthlyNetIncomeActiveHint: (annualAmount: string) => string
    annualNetIncomeActiveHint: string
    monthlyNonHousingCosts: string
    monthlyNonHousingCostsHint: string
    initialCash: string
    investmentReturn: string
    expectedRent: string
    rentGrowth: string
    buyAfterYears: string
    buyAfterYearsHint: string
    homePrice: string
    downPayment: string
    mortgageInterest: string
    mortgageTerm: string
    specialRepayment: string
    specialRepaymentHomeHint: string
    specialRepaymentRentalHint: string
    useSurplusForHomePrepayment: string
    useSurplusForHomePrepaymentHint: string
    useSurplusForRentalPrepayment: string
    propertyGrowth: string
    maintenance: string
    ownerCostsMonthly: string
    transferTax: string
    notaryAndRegistry: string
    agentFee: string
    otherOneTimeCosts: string
    homeMonthlyCostHint: string
    rentalPrice: string
    rentalMortgageEnabled: string
    monthlyColdRent: string
    vacancy: string
    nonRecoverableCosts: string
    managementFee: string
    marginalIncomeTax: string
    solidarity: string
    churchTax: string
    depreciation: string
    depreciationHint: string
    buildingShare: string
    buildingShareHint: string
    rentalTaxHint: string
    householdAdults: string
    householdChildren: string
    householdLifestylePct: string
    householdTransportMonthly: string
    householdInsuranceMonthly: string
    householdDiningMonthly: string
    householdVacationYearly: string
    householdChildcareMonthly: string
  }
  results: {
    label: string
    hint: string
    baseline: string
    vsBaseline: (value: string) => string
    monthlyInvestableNow: string
    breakEvenVsRent: string
    noBreakEven: string
    breakEvenValue: (months: number, yearsLabel: string) => string
    clickHint: string
  }
  cashflow: {
    label: string
    hint: string
    strategy: string
    monthlyPayment: string
    mortgagePart: string
    extraPayoff: string
    investableCash: string
  }
  charts: {
    netWorthLabel: string
    netWorthHint: string
    mortgageLabel: string
    mortgageHint: string
    comparisonLabel: string
    comparisonHint: string
    budgetLabel: string
    budgetHint: string
    selectedStrategy: string
    finalNetWorth: string
    yearLabel: (value: number | string) => string
    nonHousing: string
    housing: string
    savings: string
    shortfall: string
  }
  scenarios: {
    label: string
    hint: string
    scenarioLabel: (id: number) => string
  }
  warnings: {
    label: string
    hint: string
  }
  strategyLabels: StrategyLabels
}

export const translations: Record<Locale, Translation> = {
  en: {
    languageLabel: 'Language',
    languages: { en: 'English', de: 'Deutsch' },
    header: {
      eyebrow: 'Practical living calculator',
      title: 'Rent, buy now, buy later, or buy-to-let first',
      intro:
        'Start simple, then go deeper only if needed. The calculator uses your income, living costs, rent, mortgage settings, and optional buy-to-let taxes to estimate what happens to your monthly surplus and your balance sheet over time.',
    },
    summary: {
      planningLabel: 'Current snapshot',
      planningHint: 'These are read-only summaries of the assumptions currently driving the model.',
      horizon: 'Horizon',
      income: 'Active income',
      livingCosts: 'Living costs',
      cashToday: 'Cash today',
      editStep: 'Edit in step 1',
      readOnly: 'Read-only summary',
      activeInput: 'Active input',
    },
    readThis: {
      label: 'How To Read This',
      hint: 'Use this as a practical screening tool, not tax advice or a bank approval tool.',
      finalNetWorthTitle: 'Final net worth',
      finalNetWorthBody: 'Which option leaves you wealthier at the end of the chosen horizon.',
      monthlyInvestableTitle: 'Monthly investable cash',
      monthlyInvestableBody:
        'How much money is left each month after income, non-housing costs, rent or mortgage, taxes, and optional overpayments.',
      breakEvenTitle: 'Break-even',
      breakEvenBody: 'The first month when a strategy overtakes simple renting plus investing.',
    },
    guided: {
      label: 'Guided Setup',
      stepBadge: 'Guided step',
      next: 'Next',
      back: 'Back',
      advancedHint: 'You can still open every detailed input below.',
      steps: [
        { title: '1. Income and buffer', prompt: 'Start with income, cash, household profile, and non-housing living costs.' },
        { title: '2. Living and buying', prompt: 'Set rent today and the home you could buy for yourself.' },
        { title: '3. Optional buy-to-let', prompt: 'Only fill this in if you want to test buying a smaller flat for renting out.' },
      ],
    },
    quickActions: {
      label: 'Quick Scenarios',
      hint: 'These buttons change multiple assumptions at once. Active cards show which shortcut is currently applied.',
      saveScenario: 'Save current scenario',
      saveScenarioHint: 'Store the current results so you can compare them later.',
      activeBadge: 'Active',
      inactiveBadge: 'Shortcut',
      currentLabel: 'Current quick changes',
      noScenario: 'No shortcut is currently active.',
      investInstead: 'Invest surplus instead of prepaying',
      investInsteadDescription: 'Turns off mortgage overpayments so extra cash stays invested.',
      aggressiveHome: 'Pay home mortgage aggressively',
      aggressiveHomeDescription: 'Sets 5% special repayment and routes surplus to the home mortgage.',
      aggressiveRental: 'Pay buy-to-let mortgage aggressively',
      aggressiveRentalDescription: 'Sets 5% special repayment and routes surplus to the rental mortgage.',
      waitLonger: 'Wait longer, buy with more cash',
      waitLongerDescription: 'Moves delayed purchase to year 4 and raises the home down payment to 30%.',
    },
    advanced: {
      label: 'Advanced Inputs',
      hint: 'Hidden by default to keep the screen simpler. Open only what you want to fine-tune.',
      money: 'Money and horizon',
      liveAndBuy: 'Living and buy-home assumptions',
      buyToLet: 'Buy-to-let assumptions',
    },
    sections: {
      whereYouLive: 'Where you live today',
      buyHome: 'Home you could buy for yourself',
      rentalIncome: 'Rental income',
      berlinDefaults: 'Berlin acquisition defaults, still editable',
      berlinTaxModel: 'Berlin tax model for buy-to-let',
    },
    estimator: {
      label: 'Estimate living costs from household questions',
      hint: 'Answer a few family and lifestyle questions to get a rough monthly non-housing cost estimate.',
      roughModel: 'Rough model only. It is meant to speed up setup, not replace your real budget.',
      useEstimate: 'Use this estimate for monthly living costs',
      estimateReady: 'Estimated monthly living costs',
      groceries: 'Groceries',
      essentials: 'Essentials',
      lifestyleAdjustment: 'Lifestyle adjustment',
    },
    fields: {
      currencySymbol: 'Currency symbol',
      horizonYears: 'Comparison horizon (years)',
      annualNetIncome: 'Yearly net income',
      annualNetIncomeHint: 'Use the money that actually reaches your account after salary tax and social deductions.',
      monthlyNetIncomeToggle: 'Use monthly net income as the active input',
      monthlyNetIncomeToggleHint: 'Keep yearly income for reference, but let the simulation run from a direct monthly figure when this is enabled.',
      monthlyNetIncome: 'Monthly net income (optional)',
      monthlyNetIncomeHint: 'Useful if bonuses or partial-year changes make the annual number less reliable.',
      monthlyNetIncomeActiveHint: (annualAmount) => `Monthly override is active. Annual equivalent: ${annualAmount}.`,
      annualNetIncomeActiveHint: 'Yearly net income is currently the active input.',
      monthlyNonHousingCosts: 'Monthly non-housing costs',
      monthlyNonHousingCostsHint: 'Food, transport, insurance, travel, childcare, subscriptions, and everything else besides rent or mortgage.',
      initialCash: 'Current liquid cash / net worth',
      investmentReturn: 'Investment return (annual %)',
      expectedRent: 'Monthly expected rent',
      rentGrowth: 'Rent growth (annual %)',
      buyAfterYears: 'Buy after renting for (years)',
      buyAfterYearsHint: 'For the delayed-buy strategy. If cash is not enough at that time, the model keeps renting and warns you.',
      homePrice: 'Home purchase price',
      downPayment: 'Down payment (%)',
      mortgageInterest: 'Mortgage interest (annual %)',
      mortgageTerm: 'Mortgage term (years)',
      specialRepayment: 'Special repayment per year (%)',
      specialRepaymentHomeHint: 'Typical German Sondertilgung. The model caps it at 5%.',
      specialRepaymentRentalHint: 'Applies yearly and is capped at 5%.',
      useSurplusForHomePrepayment: 'Use all positive monthly surplus to prepay mortgage',
      useSurplusForHomePrepaymentHint: 'Instead of investing your monthly surplus, send it to mortgage principal.',
      useSurplusForRentalPrepayment: 'Use all positive monthly surplus to prepay rental mortgage',
      propertyGrowth: 'Property growth (annual %)',
      maintenance: 'Maintenance (annual % of value)',
      ownerCostsMonthly: 'Other owner costs (monthly)',
      transferTax: 'Grunderwerbsteuer (%)',
      notaryAndRegistry: 'Notary + registry (%)',
      agentFee: 'Agent fee (%)',
      otherOneTimeCosts: 'Other one-time costs',
      homeMonthlyCostHint: 'Home-buy monthly cost equals scheduled mortgage payment plus owner costs and any extra repayment you choose to make from surplus cash.',
      rentalPrice: 'Rental flat purchase price',
      rentalMortgageEnabled: 'Use mortgage for the rental flat',
      monthlyColdRent: 'Monthly cold rent',
      vacancy: 'Vacancy (%)',
      nonRecoverableCosts: 'Non-recoverable costs (monthly)',
      managementFee: 'Management fee (%)',
      marginalIncomeTax: 'Marginal income tax (%)',
      solidarity: 'Solidarity surcharge (% of income tax)',
      churchTax: 'Church tax (% of income tax)',
      depreciation: 'Depreciation (annual %)',
      depreciationHint: 'Simplified AfA-style deduction.',
      buildingShare: 'Building share of purchase price (%)',
      buildingShareHint: 'Only the building portion is depreciated.',
      rentalTaxHint: 'Buy-to-let taxes are simplified. The model taxes rental profit after running costs, mortgage interest, and depreciation, but it still ignores sale taxes and detailed interactions with your full tax return.',
      householdAdults: 'Adults in household',
      householdChildren: 'Children in household',
      householdLifestylePct: 'Lifestyle comfort (%)',
      householdTransportMonthly: 'Transport per month',
      householdInsuranceMonthly: 'Insurance and healthcare per month',
      householdDiningMonthly: 'Dining, leisure, and subscriptions per month',
      householdVacationYearly: 'Vacations per year',
      householdChildcareMonthly: 'Childcare and school per month',
    },
    results: {
      label: 'Best outcome at a glance',
      hint: 'Look at final net worth first, then monthly investable cash, then break-even timing.',
      baseline: 'Baseline',
      vsBaseline: (value) => `${value} vs baseline`,
      monthlyInvestableNow: 'Monthly investable cash now',
      breakEvenVsRent: 'Break-even vs rent:',
      noBreakEven: '—',
      breakEvenValue: (months, yearsLabel) => `${months} months (${yearsLabel})`,
      clickHint: 'Click a card to use that strategy in the charts below.',
    },
    cashflow: {
      label: 'Monthly cashflow now',
      hint: 'This is the current-month snapshot: what you pay, how much of that is mortgage, and what remains to invest or hold.',
      strategy: 'Strategy',
      monthlyPayment: 'Monthly payment',
      mortgagePart: 'Mortgage part',
      extraPayoff: 'Extra payoff',
      investableCash: 'Investable cash',
    },
    charts: {
      netWorthLabel: 'Net worth over time',
      netWorthHint: 'Each line includes investment balances and any property equity.',
      mortgageLabel: 'Mortgage balances over time',
      mortgageHint: 'Lower debt lines mean you are paying off faster. This helps compare investing versus extra repayment.',
      comparisonLabel: 'Comparison charts',
      comparisonHint: 'These charts make the differences easier to read than the cards alone.',
      budgetLabel: 'Current monthly budget donut',
      budgetHint: 'For the selected strategy, this shows where monthly money goes right now.',
      selectedStrategy: 'Selected strategy',
      finalNetWorth: 'Final net worth',
      yearLabel: (value) => `Year ${value}`,
      nonHousing: 'Non-housing costs',
      housing: 'Housing payment',
      savings: 'Investable cash',
      shortfall: 'Monthly shortfall',
    },
    scenarios: {
      label: 'Saved what-if scenarios',
      hint: 'Use this to keep a few versions around while you compare changes.',
      scenarioLabel: (id) => `Scenario ${id}`,
    },
    warnings: {
      label: 'Warnings',
      hint: 'These are feasibility warnings, not hard validation errors.',
    },
    strategyLabels: {
      rentInvest: 'Rent + invest',
      buyToLive: 'Buy now',
      rentThenBuy: 'Rent then buy',
      rentPlusBuyToLet: 'Rent + buy-to-let',
    },
  },
  de: {
    languageLabel: 'Sprache',
    languages: { en: 'English', de: 'Deutsch' },
    header: {
      eyebrow: 'Praktischer Wohnrechner',
      title: 'Mieten, sofort kaufen, später kaufen oder zuerst Buy-to-let',
      intro: 'Starte einfach und gehe nur bei Bedarf tiefer. Der Rechner nutzt dein Einkommen, deine Lebenshaltungskosten, Miete, Hypothekeneinstellungen und optionale Buy-to-let-Steuern, um monatlichen Überschuss und Vermögensentwicklung zu schätzen.',
    },
    summary: {
      planningLabel: 'Aktueller Stand',
      planningHint: 'Das sind reine Zusammenfassungen der Annahmen, die das Modell gerade verwendet.',
      horizon: 'Zeitraum',
      income: 'Aktives Einkommen',
      livingCosts: 'Lebenshaltungskosten',
      cashToday: 'Liquides Vermögen',
      editStep: 'In Schritt 1 bearbeiten',
      readOnly: 'Nur Zusammenfassung',
      activeInput: 'Aktiver Wert',
    },
    readThis: {
      label: 'So liest du das',
      hint: 'Das ist ein praktisches Screening-Tool, keine Steuerberatung und keine Bankzusage.',
      finalNetWorthTitle: 'Endvermögen',
      finalNetWorthBody: 'Welche Option dich am Ende des gewählten Zeitraums vermögender macht.',
      monthlyInvestableTitle: 'Monatlich investierbarer Betrag',
      monthlyInvestableBody: 'Wie viel Geld pro Monat nach Einkommen, sonstigen Lebenshaltungskosten, Miete oder Hypothek, Steuern und optionalen Sondertilgungen übrig bleibt.',
      breakEvenTitle: 'Break-even',
      breakEvenBody: 'Der erste Monat, in dem eine Strategie einfaches Mieten plus Investieren überholt.',
    },
    guided: {
      label: 'Geführte Eingabe',
      stepBadge: 'Schritt',
      next: 'Weiter',
      back: 'Zurück',
      advancedHint: 'Alle detaillierten Eingaben kannst du unten weiterhin öffnen.',
      steps: [
        { title: '1. Einkommen und Puffer', prompt: 'Beginne mit Einkommen, vorhandenem Geld, Familienprofil und sonstigen Lebenshaltungskosten.' },
        { title: '2. Wohnen und Kaufen', prompt: 'Setze heutige Miete und die Wohnung, die du selbst kaufen könntest.' },
        { title: '3. Optionales Buy-to-let', prompt: 'Fülle das nur aus, wenn du den Kauf einer kleineren Vermietungswohnung testen willst.' },
      ],
    },
    quickActions: {
      label: 'Schnelle Szenarien',
      hint: 'Diese Buttons ändern mehrere Annahmen gleichzeitig. Aktive Karten zeigen, welcher Shortcut gerade gilt.',
      saveScenario: 'Aktuelles Szenario speichern',
      saveScenarioHint: 'Speichere die aktuellen Ergebnisse, damit du sie später vergleichen kannst.',
      activeBadge: 'Aktiv',
      inactiveBadge: 'Shortcut',
      currentLabel: 'Aktuelle Schnelländerungen',
      noScenario: 'Derzeit ist kein Shortcut aktiv.',
      investInstead: 'Überschuss investieren statt tilgen',
      investInsteadDescription: 'Schaltet Sondertilgungen aus, damit freies Geld investiert bleibt.',
      aggressiveHome: 'Eigene Hypothek aggressiv tilgen',
      aggressiveHomeDescription: 'Setzt 5% Sondertilgung und leitet Überschuss in die eigene Hypothek.',
      aggressiveRental: 'Buy-to-let-Hypothek aggressiv tilgen',
      aggressiveRentalDescription: 'Setzt 5% Sondertilgung und leitet Überschuss in die Vermietungshypothek.',
      waitLonger: 'Länger warten, mit mehr Eigenkapital kaufen',
      waitLongerDescription: 'Verschiebt den späteren Kauf auf Jahr 4 und erhöht das Eigenkapital auf 30%.',
    },
    advanced: {
      label: 'Erweiterte Eingaben',
      hint: 'Standardmäßig eingeklappt, damit der Bildschirm einfacher bleibt. Öffne nur, was du feinjustieren willst.',
      money: 'Geld und Zeitraum',
      liveAndBuy: 'Annahmen zu Wohnen und Eigennutzung',
      buyToLet: 'Annahmen zu Buy-to-let',
    },
    sections: {
      whereYouLive: 'Deine heutige Wohnsituation',
      buyHome: 'Wohnung, die du für dich selbst kaufen könntest',
      rentalIncome: 'Mieteinnahmen',
      berlinDefaults: 'Berliner Kaufnebenkosten, weiterhin editierbar',
      berlinTaxModel: 'Berliner Steuermodell für Buy-to-let',
    },
    estimator: {
      label: 'Lebenshaltungskosten aus Familienfragen schätzen',
      hint: 'Beantworte ein paar Fragen zu Familie und Lebensstil, um eine grobe monatliche Schätzung ohne Wohnkosten zu erhalten.',
      roughModel: 'Nur ein grobes Modell. Es soll die Eingabe beschleunigen, nicht dein echtes Budget ersetzen.',
      useEstimate: 'Diese Schätzung als monatliche Lebenshaltungskosten verwenden',
      estimateReady: 'Geschätzte monatliche Lebenshaltungskosten',
      groceries: 'Lebensmittel',
      essentials: 'Grundbedarf',
      lifestyleAdjustment: 'Lebensstil-Anpassung',
    },
    fields: {
      currencySymbol: 'Währungssymbol',
      horizonYears: 'Vergleichszeitraum (Jahre)',
      annualNetIncome: 'Jährliches Nettoeinkommen',
      annualNetIncomeHint: 'Nutze das Geld, das nach Steuern und Sozialabgaben tatsächlich auf deinem Konto landet.',
      monthlyNetIncomeToggle: 'Monatliches Nettoeinkommen als aktiven Wert verwenden',
      monthlyNetIncomeToggleHint: 'Das Jahreseinkommen bleibt sichtbar, aber die Simulation nutzt bei Aktivierung den direkten Monatswert.',
      monthlyNetIncome: 'Monatliches Nettoeinkommen (optional)',
      monthlyNetIncomeHint: 'Praktisch, wenn Boni oder Teiljahreseffekte die Jahreszahl ungenau machen.',
      monthlyNetIncomeActiveHint: (annualAmount) => `Monatlicher Override ist aktiv. Jahresäquivalent: ${annualAmount}.`,
      annualNetIncomeActiveHint: 'Aktuell wird das jährliche Nettoeinkommen verwendet.',
      monthlyNonHousingCosts: 'Monatliche Kosten ohne Wohnen',
      monthlyNonHousingCostsHint: 'Essen, Transport, Versicherungen, Reisen, Kinderbetreuung, Abos und alles außer Miete oder Hypothek.',
      initialCash: 'Aktuell verfügbares Geld / Nettovermögen',
      investmentReturn: 'Anlagerendite (jährlich %)',
      expectedRent: 'Erwartete Monatsmiete',
      rentGrowth: 'Mietwachstum (jährlich %)',
      buyAfterYears: 'Nach wie vielen Jahren Miete kaufen',
      buyAfterYearsHint: 'Für die Strategie "erst mieten, dann kaufen". Wenn das Geld dann nicht reicht, wird weiter gemietet und eine Warnung angezeigt.',
      homePrice: 'Kaufpreis der eigenen Wohnung',
      downPayment: 'Eigenkapital (%)',
      mortgageInterest: 'Hypothekenzins (jährlich %)',
      mortgageTerm: 'Hypothekenlaufzeit (Jahre)',
      specialRepayment: 'Sondertilgung pro Jahr (%)',
      specialRepaymentHomeHint: 'Typische deutsche Sondertilgung. Das Modell begrenzt sie auf 5%.',
      specialRepaymentRentalHint: 'Gilt pro Jahr und ist auf 5% begrenzt.',
      useSurplusForHomePrepayment: 'Gesamten positiven Monatsüberschuss zur Tilgung nutzen',
      useSurplusForHomePrepaymentHint: 'Statt den Monatsüberschuss zu investieren, wird er auf die Hypothek getilgt.',
      useSurplusForRentalPrepayment: 'Gesamten positiven Monatsüberschuss zur Tilgung der Vermietungshypothek nutzen',
      propertyGrowth: 'Wertsteigerung der Immobilie (jährlich %)',
      maintenance: 'Instandhaltung (jährlich % des Werts)',
      ownerCostsMonthly: 'Weitere Eigentümerkosten (monatlich)',
      transferTax: 'Grunderwerbsteuer (%)',
      notaryAndRegistry: 'Notar + Grundbuch (%)',
      agentFee: 'Maklergebühr (%)',
      otherOneTimeCosts: 'Weitere Einmalkosten',
      homeMonthlyCostHint: 'Die monatlichen Kosten beim Kauf entsprechen der planmäßigen Hypothekenrate plus Eigentümerkosten und optionalen Zusatzzahlungen aus Überschuss.',
      rentalPrice: 'Kaufpreis der Vermietungswohnung',
      rentalMortgageEnabled: 'Hypothek für die Vermietungswohnung nutzen',
      monthlyColdRent: 'Monatliche Kaltmiete',
      vacancy: 'Leerstand (%)',
      nonRecoverableCosts: 'Nicht umlagefähige Kosten (monatlich)',
      managementFee: 'Verwaltungsgebühr (%)',
      marginalIncomeTax: 'Grenzsteuersatz (%)',
      solidarity: 'Solidaritätszuschlag (% der Einkommensteuer)',
      churchTax: 'Kirchensteuer (% der Einkommensteuer)',
      depreciation: 'Abschreibung (jährlich %)',
      depreciationHint: 'Vereinfachte AfA-Annahme.',
      buildingShare: 'Gebäudeanteil am Kaufpreis (%)',
      buildingShareHint: 'Nur der Gebäudeanteil wird abgeschrieben.',
      rentalTaxHint: 'Buy-to-let-Steuern sind vereinfacht. Das Modell besteuert den Vermietungsgewinn nach laufenden Kosten, Hypothekenzinsen und Abschreibung, ignoriert aber weiterhin Verkaufssteuern und Details deiner gesamten Steuererklärung.',
      householdAdults: 'Erwachsene im Haushalt',
      householdChildren: 'Kinder im Haushalt',
      householdLifestylePct: 'Lebensstil-Komfort (%)',
      householdTransportMonthly: 'Transport pro Monat',
      householdInsuranceMonthly: 'Versicherungen und Gesundheit pro Monat',
      householdDiningMonthly: 'Essen gehen, Freizeit und Abos pro Monat',
      householdVacationYearly: 'Urlaub pro Jahr',
      householdChildcareMonthly: 'Kinderbetreuung und Schule pro Monat',
    },
    results: {
      label: 'Bestes Ergebnis auf einen Blick',
      hint: 'Schau zuerst auf das Endvermögen, dann auf den monatlich investierbaren Betrag und danach auf den Break-even.',
      baseline: 'Basislinie',
      vsBaseline: (value) => `${value} gegenüber Basislinie`,
      monthlyInvestableNow: 'Monatlich investierbarer Betrag jetzt',
      breakEvenVsRent: 'Break-even gegenüber Miete:',
      noBreakEven: '—',
      breakEvenValue: (months, yearsLabel) => `${months} Monate (${yearsLabel})`,
      clickHint: 'Klicke auf eine Karte, um diese Strategie in den Charts unten zu verwenden.',
    },
    cashflow: {
      label: 'Monatlicher Cashflow jetzt',
      hint: 'Das ist die aktuelle Monatsaufnahme: was du zahlst, welcher Teil Hypothek ist und was zum Investieren oder Halten bleibt.',
      strategy: 'Strategie',
      monthlyPayment: 'Monatszahlung',
      mortgagePart: 'Hypothekenanteil',
      extraPayoff: 'Zusatztilgung',
      investableCash: 'Investierbarer Betrag',
    },
    charts: {
      netWorthLabel: 'Vermögen im Zeitverlauf',
      netWorthHint: 'Jede Linie enthält Investmentvermögen und eventuelles Immobilien-Eigenkapital.',
      mortgageLabel: 'Hypothekensalden im Zeitverlauf',
      mortgageHint: 'Je niedriger die Schuldenlinie, desto schneller wird getilgt. Das hilft beim Vergleich von Investieren versus Sondertilgung.',
      comparisonLabel: 'Vergleichscharts',
      comparisonHint: 'Diese Charts machen Unterschiede leichter lesbar als die Karten allein.',
      budgetLabel: 'Aktuelles Monatsbudget als Donut',
      budgetHint: 'Für die ausgewählte Strategie zeigt dieser Donut, wohin das monatliche Geld aktuell geht.',
      selectedStrategy: 'Ausgewählte Strategie',
      finalNetWorth: 'Endvermögen',
      yearLabel: (value) => `Jahr ${value}`,
      nonHousing: 'Kosten ohne Wohnen',
      housing: 'Wohnkosten',
      savings: 'Investierbarer Betrag',
      shortfall: 'Monatliches Defizit',
    },
    scenarios: {
      label: 'Gespeicherte Was-wäre-wenn-Szenarien',
      hint: 'So kannst du mehrere Versionen behalten, während du Änderungen vergleichst.',
      scenarioLabel: (id) => `Szenario ${id}`,
    },
    warnings: {
      label: 'Warnungen',
      hint: 'Das sind Machbarkeitswarnungen, keine harten Validierungsfehler.',
    },
    strategyLabels: {
      rentInvest: 'Mieten + investieren',
      buyToLive: 'Jetzt kaufen',
      rentThenBuy: 'Erst mieten, dann kaufen',
      rentPlusBuyToLet: 'Mieten + Buy-to-let',
    },
  },
}

export function translateSimulationWarning(locale: Locale, warning: string): string {
  if (locale === 'en') {
    return warning
  }

  const monthMatch = warning.match(/^At month (\d+), saved cash is not enough to buy the home, so this strategy keeps renting\.$/)
  if (monthMatch) {
    return `Im Monat ${monthMatch[1]} reicht das angesparte Geld nicht für den Kauf, daher bleibt diese Strategie beim Mieten.`
  }

  const map: Record<string, string> = {
    'Upfront cash needed to buy the home now exceeds initial cash.': 'Das sofort benötigte Geld für den Kauf der eigenen Wohnung übersteigt das aktuelle verfügbare Geld.',
    'Upfront cash needed for the rental property exceeds initial cash.': 'Das sofort benötigte Geld für die Vermietungswohnung übersteigt das aktuelle verfügbare Geld.',
    'Upfront cash needed for the delayed-buy strategy exceeds initial cash.': 'Das sofort benötigte Geld für die Strategie "später kaufen" übersteigt das aktuelle verfügbare Geld.',
    'Monthly budget goes negative under rent + invest assumptions.': 'Das Monatsbudget wird unter den Annahmen für Mieten + Investieren negativ.',
    'Monthly budget goes negative under buy-now assumptions.': 'Das Monatsbudget wird unter den Annahmen für sofortigen Kauf negativ.',
    'Monthly budget goes negative under rent-then-buy assumptions.': 'Das Monatsbudget wird unter den Annahmen für erst mieten, dann kaufen negativ.',
    'Monthly budget goes negative under buy-to-let assumptions.': 'Das Monatsbudget wird unter den Annahmen für Buy-to-let negativ.',
  }

  return map[warning] ?? warning
}
