describe('Navigation', function () {
    // TODO add some asserts !
    it('should navigate through all the pages', function () {
        cy.log('Visit homepage')
        cy.visit('/')

        cy.log('Visit author page')
        cy.get('.author').first().click()

        cy.log('Visit article page')
        cy.visit('/')
        cy.get('.preview-link > h1').eq(2).click()

        cy.log('Logging in')
        cy.visit('/login')
    })
})