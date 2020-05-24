const urls = [
  ['https://huckberry.com/store/outerknown/category/p/59649-blanket-shirt', 'Outerknown'],
  ['https://huckberry.com/store/flint-and-tinder/category/p/55132-supima-air-knit-tee', 'Flint and Tinder'],
  ['https://huckberry.com/store/proof/category/p/60902-nomad-short', 'Proof']
];

const header = 'brandName,value1,value2';

describe('scrape', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      '__cfduid',
      '_session_id',
      'browser_has_visited_before',
      'guest_token',
      'suppress_gate_for_visit'
    );
  });

  it('closes huckberry modal', () => {
    cy.visit(urls[0][0]);
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

  for (let i = 1; i < urls.length; i++) {
    it('saves item brand name', () => {
      const readFileData = [];
      cy.visit(urls[i][0]);
      cy.readFile('cypress/fixtures/huckTest1.csv').then(a => {
        console.log(a);
        readFileData.push(a);
      });
      // cy.get(`button[class='modal-close-button']`).click();
      cy.get(`a[itemprop='brand']`).should('contain.text', urls[i][1]);
      cy.get(`a[itemprop='brand']`)
      .invoke('text')
      .then(text => {
        const brand = text;
        console.log(brand);
        cy.writeFile('cypress/fixtures/huckTest1.csv', `${readFileData[0]}\n${brand},${i} value here,and one more new ${i}`)
      });
    });
  }
});