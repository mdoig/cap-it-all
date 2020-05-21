const url = 'https://huckberry.com/store/flint-and-tinder/category/p/55132-supima-air-knit-tee';
const readFileData = [];

it('saves item brand name', () => {
  cy.visit(url);
  cy.readFile('cypress/fixtures/huckTest1.csv').then(a => {
    console.log(a);
    readFileData.push(a);
  });
  cy.get(`button[class='modal-close-button']`).click();
  cy.get(`a[itemprop='brand']`).should('contain.text', 'Flint and Tinder');
  cy.get(`a[itemprop='brand']`)
    .invoke('text')
    .then(text => {
      const brand = text;
      console.log(brand);
      cy.writeFile('cypress/fixtures/huckTest1.csv', `${readFileData[0]}\n${brand},new value here,and one more new`)
    });
});