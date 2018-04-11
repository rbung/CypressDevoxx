describe('Article page', function () {
    it('should display the article page', function () {
        cy.server()
        cy.route('/api/articles/article2-oni8y2', 'fixture:/article/article-oni8y2.json').as('getArticle')
        cy.route('/api/articles/article2-oni8y2/comments', 'fixture:/comments/comments-oni8y2.json').as('getArticleComments')
        cy.route('/sockjs-node/**', {})

        cy.visit('/article/article2-oni8y2')
        cy.get('h1').should('contain', 'Article2')
        cy.get('.author').should('contain', 'sz')
        cy.get('.date').should('contain', 'Wed Apr 11 2018')
        cy.get('.article-content').should('contain', 'Hi')
        cy.get('.tag-list').should('contain', 'tag1')

        cy.get('.card').should('have.length', 2)
        cy.get('.card').eq(0).should('contain', 'First comment')
        cy.get('.card').eq(1).should('contain', 'Second comment')
    })

    it('should display nothing when the article is not found', function () {
        cy.server()
        cy.route({
            url: '/api/articles/**',
            status: 404,
            response: {},
            delay: 42,
            headers: {
                'X-Token': null
            }
        }).as('getArticle')

        cy.visit('/article/article2-oni8y2')
    })

    it('should display after a long request', function () {
        cy.server()
        cy.route({
            url: '/api/articles/**',
            response: 'fixture:/article/article-oni8y2.json',
        }).as('getArticle')
        cy.route('/api/articles/article2-oni8y2/comments', 'fixture:/comments/comments-oni8y2.json').as('getArticleComments')
        cy.route('/sockjs-node/**', {})

        cy.visit('/article/article2-oni8y2')
    })

})