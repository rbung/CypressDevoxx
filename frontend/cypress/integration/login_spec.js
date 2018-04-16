describe('Login page', function () {

    it('should display nicely', function () {
        cy.visit('/login')
        cy.contains('Sign In').should('exist')
        cy.get('input[type=email]').should('exist')
        cy.get('input[type=password]').should('exist')
        cy.get('button[type=submit]').should('exist')
    })

    it('should display error message when empty email and password are submitted', function () {
        cy.visit('/login')
        cy.get('button[type=submit]').click()
        cy.contains('email or password is invalid').should('exist')
    })

    it('should display error message when password is empty', function () {
        cy.visit('/login')
        cy.get('input[type=email]').type('test@test.com{enter}')
        cy.contains('email or password is invalid').should('exist')
    })

    it('should display error message when email is empty', function () {
        cy.visit('/login')
        cy.get('input[type=password]').type('password{enter}')
        cy.contains('email or password is invalid').should('exist')
    })

    it('should display error message when login failed', function () {
        cy.visit('/login')
        cy.get('input[type=email]').type('cypress@devoxx.fr')
        cy.get('input[type=password]').type('wrong{enter}')
        cy.contains('email or password is invalid').should('exist')
    })

    it('should redirect to homepage when logging is successful', function () {
        cy.visit('/login')
        cy.get('input[type=email]').type('cypress@devoxx.fr')
        cy.get('input[type=password]').type('cypressdevoxx{enter}')
        cy.url().should('contain', '/')
    })

})