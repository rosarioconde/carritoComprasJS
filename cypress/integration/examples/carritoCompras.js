// const URL = 'http://127.0.0.1:5500/index.html'

// context('compras', () => {
//     before(() => {
//         cy.visit(URL);
//     })
// })
describe('My First Test', () => {
    it('PRUEBA INDEX', () => {
        cy.visit('http://127.0.0.1:5500/index.html')
    })
})