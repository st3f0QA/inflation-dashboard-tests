export class DashboardPage{
    constructor(){
        this.canvasArea = '[data-testid="display-area"]'
        this.tables = '[data-testid="visual-content-desc"]'
        this.row = '[role="row"]'
        this.mainTable = '[class="mid-viewport"]'
        this.countryNameColumn = '[role="gridcell"][column-index="0"]'
        this.inflationColumn = '[column-index="1"]';
        this.healthColumn = '[column-index="2"]';
        this.exportColumn = '[column-index="3"]'
        this.importColumn = '[column-index="4"]'
        this.gdpColumn =  '[column-index="5"]'
        this.generalPageView = '[data-testid="visual-background-container"]'
        this.optionFromHealthTable = 'rect[data-automation-type="column-chart-rect"]'
        this.scrollableMainTableRows = '.scrollable-cells-container'
        this.highlightedCountryInTable = 'text[role="option"]'
       
    }
    visitDashboard(){
        cy.visit(Cypress.env('INFLATION_URL'));
        cy.get(this.canvasArea).should('be.visible')
        cy.contains('Income for person').should('be.visible')
    }
    scrollAndFindCountry(countryName, maxScrolls = 12, currentScroll = 0, scrollOffset = 0) {
        if (currentScroll >= maxScrolls) {
          throw new Error(`Country "${countryName}" not found after ${maxScrolls} scrolls.`);
        }
      
        cy.get(this.countryNameColumn).then(($cells) => {
          let found = false;
          let targetRow;
      
          $cells.each((index, cell) => {
            const countryText = Cypress.$(cell).text().trim();
            if (countryText === countryName) {
              found = true;
              targetRow = Cypress.$(cell).closest(this.row);
              return false; 
            }
          });
      
          if (found && targetRow) {
            cy.extractCountryDataFromRow(targetRow);
          } else {
            const newOffset = scrollOffset + 500;
            cy.get(this.mainTable).scrollTo(0, newOffset, { duration: 500 }).then(() => {
              cy.wait(1000); 
              this.scrollAndFindCountry(countryName, maxScrolls, currentScroll + 1, newOffset);
            });
          }
        });
    }
    pickAndSelectCountryFromHealthTable(){
        cy.get(this.optionFromHealthTable).eq(0)
        .click()
    }

    scrollAndCollectAllCountriesInflation(collected = [], maxScrolls = 12, currentScroll = 0, scrollOffset = 0) {
        if (currentScroll >= maxScrolls) {
          const top8 = collected
            .sort((a, b) => b.inflation - a.inflation)
            .slice(0, 8);
      
          cy.wrap(top8).as('top8InflationCountries');
          return;
        }
      
        cy.get(this.countryNameColumn).then(($cells) => {
          $cells.each((index, cell) => {
            const $cell = Cypress.$(cell);
            const countryName = $cell.text().trim();
            const inflationCell = $cell.closest(this.row).find(this.inflationColumn);
            const inflationValue = parseFloat(inflationCell.text().trim().replace('%', ''));
      
            if (!collected.some(entry => entry.name === countryName)) {
              collected.push({ name: countryName, inflation: inflationValue });
            }
          });
      
          const newOffset = scrollOffset + 500;
          cy.get(this.mainTable).scrollTo(0, newOffset, { duration: 500 }).then(() => {
            cy.wait(1000);
            this.scrollAndCollectAllCountriesInflation(collected, maxScrolls, currentScroll + 1, newOffset);
          });
        });
    }
}
    
