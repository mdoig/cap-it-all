const urls = [
  ['https://huckberry.com/store/outerknown/category/p/59649-blanket-shirt','Outerknown'],
  ['https://huckberry.com/store/flint-and-tinder/category/p/55132-supima-air-knit-tee','Flint and Tinder'],
  ['https://huckberry.com/store/proof/category/p/60902-nomad-short','Proof']
];

for (let i = 0; i < urls.length; i++) {
  it('closes huckberry modal', () => {
    cy.visit(urls[i][0]);
    cy.get('.modal-close-button').click();
    cy.get('.modal-content').should('not.exist');
  });

  it(`gets and saves item brand name ${i}`, () => {
    cy.get(`a[itemprop='brand']`).should('contain.text', urls[i][1]);
    cy.get(`a[itemprop='brand']`)
      .invoke('text')
      .then(text => {
        const brand = text;
        console.log(brand);
        const data = `${brand},${i} value here,and one more for ${i}`;
        cy.task('log', data);
      });
  });
}