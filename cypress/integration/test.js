const url = 'https://huckberry.com/store/outerknown/category/p/59649-blanket-shirt';
const header = 'brandName,value1,value2';

it('closes huckberry modal', () => {
  cy.visit(url);
  cy.get('.modal-close-button').click();
  cy.get('.modal-content').should('not.exist');
});

it('gets and saves item brand name', () => {
  cy.get(`a[itemprop='brand']`).should('contain.text', 'Outerknown');
  cy.get(`a[itemprop='brand']`)
    .invoke('text')
    .then(text => {
      const brand = text;
      console.log(brand);
      cy.writeFile('cypress/fixtures/huckTest1.csv', `${header}\n${brand},other value here,and one more`)
    });
});