const url = 'https://huckberry.com/store/outerknown/category/p/59649-blanket-shirt';

it('closes huckberry modal', ()=>{
    cy.visit(url);
    cy.get('.modal-close-button').click();
    cy.get('.modal-content').should('not.exist');
});