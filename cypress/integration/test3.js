const url = 'https://huckberry.com/store/proof/category/p/60902-nomad-short';
const readFileData = [];

it('saves item brand name', () => {
  cy.visit(url);
  cy.readFile('cypress/fixtures/huckTest1.csv').then(a => {
    // console.log(a);
    readFileData.push(a);
    console.log(readFileData[0]);
  });
  cy.get(`button[class='modal-close-button']`).click();
  cy.get(`a[itemprop='brand']`).should('contain.text', 'Proof');
  cy.get(`a[itemprop='brand']`)
    .invoke('text')
    .then(text => {
      const brand = text;
      console.log(brand);
      cy.writeFile('cypress/fixtures/huckTest1.csv', `${readFileData[0]}\n${brand},3 value here,and one more 3`);
      cy.readFile('cypress/fixtures/huckTest1.csv').then(a => {
        console.log(a);
      })
    });
});