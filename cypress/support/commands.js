import { DashboardPage } from '../support/pages/dashboard.po';

const dashboard = new DashboardPage()
Cypress.Commands.add('extractCountryDataFromRow',(targetRow)=>{
    const result = {};
    cy.wrap(targetRow).within(() => {
        cy.get(dashboard.inflationColumn).invoke('text').then((text) => {
            result.inflation = text.replace(/[^\d,]/g, '').trim();
            cy.log('Inflation:', result.inflation);
        });

        cy.get(dashboard.healthColumn).invoke('text').then((text) => {
            const match = text.match(/^\d+[\.,]?\d*/); // Match number at the start
            result.health = match ? match[0].replace(',', '.') : ''; // Replace comma with dot if needed
            cy.log('health:', result.health);
        });

        cy.get(dashboard.exportColumn).invoke('text').then((text) => {
            const match = text.match(/^\d+[\.,]?\d*/); // Match number at the start
            result.export = match ? match[0].replace(',', '.') : ''; // Replace comma with dot if needed
            cy.log('export:', result.export);
        });

        cy.get(dashboard.importColumn).invoke('text').then((text) => {
            const match = text.match(/^\d+[\.,]?\d*/); // Match number at the start
            result.import = match ? match[0].replace(',', '.') : ''; // Replace comma with dot if needed
            cy.log('import:', result.import);
        });

        cy.get(dashboard.gdpColumn).invoke('text').then((text) => {
            const match = text.match(/\d{1,3}(,\d{3})*/);
            result.gdp = match ? match[0] : '';
            cy.log('GDP:', result.gdp);
        });
    }).then(() => {
        cy.wrap(result).as('countryData'); 
    });
})
Cypress.Commands.add('simplifyText',(locator)=>{
    cy.get(dashboard.healthColumn).invoke('text').then((text) => {
        const match = text.match(/^\d+[\.,]?\d*/); // Match number at the start
        result.health = match ? match[0].replace(',', '.') : ''; // Replace comma with dot if needed
        cy.log('Text:', result.health);
    });
})
Cypress.Commands.add('getTop8FromPieChart', () => {
    const results = [];
  
    cy.get(dashboard.tables).eq(2)
      .find('text.label')
      .each(($el) => {
        const text = $el.text().trim();
  
        // Extract country and inflation number using regex
        const match = text.match(/^([^\d]+)\s?(\d+(\.\d+)?)/) || text.match(/^(\d+(\.\d+)?)\s?([^\d]+)/);
        if (match) {
          const country = (match[1] || match[3]).trim();
          const inflation = parseFloat(match[2] || match[1]);
          if (country && !isNaN(inflation)) {
            results.push({ name: country, inflation });
          }
        }
      })
      .then(() => {
        const sorted = results.sort((a, b) => b.inflation - a.inflation).slice(0, 8);
        cy.wrap(sorted).as('top8PieChart');
      });
  });   