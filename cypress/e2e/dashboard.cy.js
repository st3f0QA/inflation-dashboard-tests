import { DashboardPage } from '../support/pages/dashboard.po';
const dashboard = new DashboardPage()
   describe('Dashboard tests',()=>{
        it('Should load the page and compare data',()=>{
          dashboard.visitDashboard()
          dashboard.scrollAndFindCountry('Germany')
          cy.fixture('expectedData.json').then((expectedData) => {
            cy.get('@countryData').then((actualData) => {
              expect(actualData.gdp).to.equal(expectedData.gdp);
              expect(actualData.health).to.equal(expectedData.health);
              expect(actualData.export).to.equal(expectedData.export);
              expect(actualData.import).to.equal(expectedData.import);
            });
          });
        })
        it('Pick a country and check the different tables and charts',()=>{
          dashboard.visitDashboard()
          dashboard.pickAndSelectCountryFromHealthTable()
          cy.wait(2000)
          dashboard.scrollAndFindCountry('United States')
          cy.get('@countryData').then((actualData) => {
            cy.get(dashboard.canvasArea).should('contain',actualData.gdp)
          })
          cy.get(dashboard.scrollableMainTableRows).should('have.length',2)//header and the row with country
        })
        it('Validates top 8 inflation countries match pie chart', () => {
          dashboard.visitDashboard();
          dashboard.scrollAndCollectAllCountriesInflation();
          cy.getTop8FromPieChart();
          cy.get('@top8InflationCountries').then((fromTable) => {
            cy.get('@top8PieChart').then((fromChart) => {
              const tableNames = fromTable.map(c => c.name);
              const chartNames = fromChart.map(c => c.name);
              tableNames.forEach((name) => {
                expect(chartNames).to.include(name);
              });
            });
          });
        });
        it('Matches dashboard layout with snapshot',()=>{
          dashboard.visitDashboard()
          cy.wait(3000)
          cy.get(dashboard.generalPageView).matchImageSnapshot();
        })
        it('Displays detailed view correctly when clicking on a top inflation country', () => {
          dashboard.visitDashboard();
          dashboard.scrollAndCollectAllCountriesInflation();
          cy.getTop8FromPieChart();
      
          cy.get('@top8PieChart').then((top8) => {
            const targetCountry = top8[0].name;
            const desiredCountry = `path[aria-label*=${targetCountry}]` 
            cy.get(desiredCountry).should('exist').click({force:true})
            cy.get(dashboard.highlightedCountryInTable).contains(targetCountry).should('exist');
            cy.wait(1000)
            dashboard.scrollAndFindCountry(targetCountry)
            cy.get('@countryData').then((actualData) => {
              cy.get(dashboard.tables).eq(1).should('contain',actualData.gdp)
            });
           
          });
        });
    })