# Dashboard E2E Test Suite (Cypress)

This repository contains end-to-end (E2E) tests written in **Cypress** for validating a data-rich dashboard UI. The tests verify country data, inflation rates, visual charts, and layout consistency.

---

## Installation

After cloning the repo, install dependencies:

```bash
npm install
```
To open the tests in headed mode:
npx cypress open

## Test Coverage
✅ Load and compare country data  -	Verifies GDP, health, import/export against expected values

✅ Pick a country from health table  -  Clicks on health chart entry and checks table/chart alignment

✅ Validate top 8 inflation countries  -  Compares top 8 table data with the inflation pie chart

✅ Visual regression snapshot  -  Confirms general dashboard layout hasn't visually changed

✅ Detailed view click  -  Simulates pie chart click and confirms detailed country view loads

## Reporting
Mochawesome is used for reporting the test. The report is saved as .json and then changed to .html.
The report can be found at **cypress\reports\mochawesome.html** --> https://github.com/st3f0QA/inflation-dashboard-tests/blob/main/cypress/reports/mochawesome.html

Bug report is created and can be found in the /issues tab --> https://github.com/st3f0QA/inflation-dashboard-tests/issues/1

