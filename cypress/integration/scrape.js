import { urls } from '../support/urlsList.js';

const header = 'brandName,itemName,itemColor,currentPrice,regularPrice,inStock,url';

describe('scrape', () => {
  before(() => {
    cy.visit(`https://huckberry.com/store/${urls[0]}`);
    cy.get('.modal-close-button').should('be.visible').click();
    cy.get('.modal-content').should('not.exist');
    cy.writeFile(
      'data/scrape.csv',
      `${header}`
    );
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      '__cfduid',
      '_session_id',
      'browser_has_visited_before',
      'guest_token',
      'suppress_gate_for_visit'
    );
  });

  for (let i = 0; i < urls.length; i++) {
    it(`gets item ${i + 1} info`, () => {
      const readFileData = [];
      cy.visit(`https://huckberry.com/store/${urls[i]}`);
      cy.readFile('data/scrape.csv').then(data => {
        readFileData.push(data);
      });
      const itemInfo = [];
      cy.get(`a[class='color--gray-text-light color--blue--hover fg--xxsmall fw--500']`).invoke('text').then(text => { itemInfo.push(text) });
      cy.get(`h1[class='fg-condensed--small pr2 fw--600']`).invoke('text').then(text => { itemInfo.push(text) });
      cy.get('p.mb1').children().eq(2).invoke('text').then(text => { itemInfo.push(text) });
      cy.get(`div[class='media__fixed text-right']`).children().then(children => {
        if (children.length === 2) {
          itemInfo.push(children[0].textContent.replace(',', '').replace('$', ''));
          itemInfo.push(children[1].textContent.replace(',', '').replace('$', ''));
        } else {
          itemInfo.push(children[0].textContent.replace(',', '').replace('$', ''));
          itemInfo.push(children[0].textContent.replace(',', '').replace('$', ''));
        }
      });
      cy.get('button.button--primary--yellow').invoke('text').then(text => {
        if (text.toLowerCase() === 'notify me') {
          itemInfo.push('n')
        } else {
          itemInfo.push('y')
        }
      });
      cy.url().then(url => {
        itemInfo.push(url);
        cy.writeFile(
          'data/scrape.csv',
          `${readFileData[0]}\n${itemInfo[0]},${itemInfo[1]},${itemInfo[2]},${itemInfo[3]},${itemInfo[4]},${itemInfo[5]},${itemInfo[6]}`
        );
      });
    });
  }
});
