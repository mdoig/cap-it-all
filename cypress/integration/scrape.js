import { urls } from '../support/urlsList.js';

const header = 'brandName,itemName,itemColor,itemPrice,itemImage';

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
    cy.visit(`https://huckberry.com/store/${urls[0]}`);
    cy.get('.modal-close-button').click();
    cy.get('.modal-content').should('not.exist');
  });

  it('gets item 1 info', () => {
    const itemInfo = [];
    cy.get(`a[itemprop='brand']`).invoke('text').then(text => { itemInfo.push(text) });
    cy.get(`h1[itemprop='name']`).invoke('text').then(text => { itemInfo.push(text) });
    cy.get('p.mb1').children().eq(2).invoke('text').then(text => { itemInfo.push(text) });
    cy.get(`meta[itemprop='price']`).invoke('attr', 'content').then(value => { itemInfo.push(value) });
    cy.get(`img[itemprop='image']`).invoke('attr', 'src').then(value => {
      itemInfo.push(value);
      cy.writeFile(
        'cypress/fixtures/huckTest1.csv',
        `${header}\n${itemInfo[0]},${itemInfo[1]},${itemInfo[2]},${itemInfo[3]},${itemInfo[4]}`
      );
    });
  });
  
  for (let i = 1; i < urls.length; i++) {
    it(`gets item ${i+1} info`, () => {
      const readFileData = [];
      cy.visit(`https://huckberry.com/store/${urls[i]}`);
      cy.readFile('cypress/fixtures/huckTest1.csv').then(data => {
        readFileData.push(data);
      });
      const itemInfo = [];
      cy.get(`a[itemprop='brand']`).invoke('text').then(text => { itemInfo.push(text) });
      cy.get(`h1[itemprop='name']`).invoke('text').then(text => { itemInfo.push(text) });
      cy.get('p.mb1').children().eq(2).invoke('text').then(text => { itemInfo.push(text) });
      cy.get(`meta[itemprop='price']`).invoke('attr', 'content').then(value => { itemInfo.push(value) });
      cy.get(`img[itemprop='image']`).invoke('attr', 'src').then(value => {
        itemInfo.push(value);
        cy.writeFile(
          'cypress/fixtures/huckTest1.csv',
          `${readFileData[0]}\n${itemInfo[0]},${itemInfo[1]},${itemInfo[2]},${itemInfo[3]},${itemInfo[4]}`
        );
      });
    });
  }
});