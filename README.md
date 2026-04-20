# Rent vs Buy (Berlin-friendly, works anywhere)

Frontend-only calculator that compares four strategies over a chosen horizon:

1. Rent + invest
2. Buy to live (annuity mortgage) + invest the monthly difference vs renting
3. Rent for a while, then buy if accumulated cash is sufficient
4. Rent to live + buy a smaller flat to rent out (buy-to-let), invest rental cashflow

The UI uses a wizard-style flow for the main questions and keeps a full advanced editor underneath. All assumptions remain editable: income, optional monthly net-income override, non-housing costs, household-based living-cost estimates, rent, prices, growth rates, purchase costs, mortgage terms, special repayments, aggressive payoff toggles, vacancy, and a simplified Berlin/Germany rental-tax model.

## Run locally

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Tests: `npm run test`

## GitHub Pages deploy

- The repo is prepared for project-site deployment at `/practical-living/`.
- The workflow file `.github/workflows/deploy-pages.yml` deploys on every push to `main`.
- Before the first deploy, enable GitHub Pages in the repository settings and set the source to `GitHub Actions`.
- Local production-style build for Pages: `VITE_BASE_PATH=/practical-living/ npm run build`

## Notes

- Monthly investable cash is derived from yearly net income by default, but you can optionally override it with a direct monthly net-income figure before subtracting non-housing costs and housing costs.
- Step 1 now includes a household questionnaire that estimates monthly non-housing costs from adults, children, lifestyle, transport, insurance, vacations, dining, and childcare.
- Monthly payment summaries are shown for every strategy, including scheduled mortgage payments and any extra repayment currently being applied.
- Buy-to-let includes a simplified Berlin/Germany rental tax model based on marginal tax, solidarity surcharge, church tax, interest deductibility, and depreciation.
- Mortgages can model yearly special repayment up to 5% and an option to route all positive monthly surplus into principal payoff.
- The interface now includes a simple locale switch so the main UI can be viewed in English or German, with mobile-friendly stacking for smaller screens.
- Top-level assumption cards are summaries rather than fake inputs, and quick scenarios now show active visual state so it is easier to see what changed.
- The results area includes additional charts beyond the line views, including a final-net-worth comparison bar chart and a current-budget donut chart for the selected strategy.
- The app still ignores exit tax, investment tax, and selling transaction costs.
- Numbers are nominal and simplified; use for intuition, not financial advice.
