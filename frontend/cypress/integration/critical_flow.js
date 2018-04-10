describe('Navigation', function () {
    it('should navigate as an anonymous user', function () {
        cy.log('Visit homepage')
        cy.visit('/')
        cy.title().should('eq', 'Conduit')
        cy.get('.article-meta').should('have.length', 10)
        cy.get('.tag-list').should('have.length.above', 1)

        cy.log('Visit author page')
        cy.get('.author').first().click()
        cy.url().should('contain', '@')
        cy.get('.user-info').should('exist')

        cy.log('Visit article page')
        cy.visit('/')
        cy.get('.preview-link > h1').eq(2).click()
    })
    it('should navigate as an authenticated user', function () {
        cy.log('Logging in')
        cy.visit('/login')
        cy.get('input[type=email]').type('cypress@devoxx.fr')
        cy.get('input[type=password]').type('cypressdevoxx')
        cy.get('button[type="submit"]').click()

        cy.url().should('contain', '/')
        cy.get('.feed-toggle .nav .nav-link')
            .should(($links) => {
                expect($links).to.have.length(2)
                expect($links.first()).to.contain('Your Feed')
                expect($links.last()).to.contain('Global Feed')
            })

        cy.get('.feed-toggle .nav .nav-link').last().as('GlobalFeed')

        cy.log('Visit author page')
        cy.visit('/')
        cy.get('@GlobalFeed').click()
        cy.get('.author').first().click()
        cy.url().should('contain', '@')
        cy.get('.user-info').should('exist')

        cy.log('Visit article page')
        cy.visit('/')
        cy.get('@GlobalFeed').click()
        cy.get('.preview-link > h1').eq(2).click()
        cy.url().should('contain', 'article')
    })
})