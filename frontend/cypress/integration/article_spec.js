describe('Article page', function () {
    context('In an anonymous context', function () {
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
            cy.route('/api/articles/article2-oni8y2/comments', 'fixture:/comments/comments-oni8y2.json').as('getArticleComments')
            cy.route('/sockjs-node/**', {})
            cy.route({
                url: '/api/articles/**',
                status: 500,
                response: {error: 'internal server error'},
                delay: 42
            }).as('getArticle')

            cy.visit('/article/article2-oni8y2')
            cy.get('.navbar').should('exist')
        })

        it('should display after a long request', function () {
            cy.server()
            cy.route({
                url: '/api/articles/**',
                response: 'fixture:/article/article-oni8y2.json',
                delay: 500
            }).as('getArticle')
            cy.route('/api/articles/article2-oni8y2/comments', 'fixture:/comments/comments-oni8y2.json').as('getArticleComments')
            cy.route('/sockjs-node/**', {})

            cy.visit('/article/article2-oni8y2')
            cy.get('h1').should('contain', 'Article2')
            cy.get('.author').should('contain', 'sz')
            cy.get('.date').should('contain', 'Wed Apr 11 2018')
            cy.get('.article-content').should('contain', 'Hi')
            cy.get('.tag-list').should('contain', 'tag1')
        })
    })

    context('In an authenticated context', function () {
        beforeEach(function () {
            cy.visit('/login')
            cy.get('input[type=email]').type('cypress@devoxx.fr')
            cy.get('input[type=password]').type('cypressdevoxx{enter}')
            cy.contains('cypressdevoxx').should('exist')

            cy.server()
            cy.route('/api/articles/article2-oni8y2', 'fixture:/article/article-oni8y2.json').as('getArticle')
            cy.route('/api/articles/article2-oni8y2/comments', 'fixture:/comments/comments-oni8y2.json').as('getArticleComments')
            cy.route('/sockjs-node/**', {})
            cy.visit('/article/article2-oni8y2')
        })

        it('should display the article page', function () {
            cy.get('h1').should('contain', 'Article2')
            cy.get('.author').should('contain', 'sz')
            cy.get('.date').should('contain', 'Wed Apr 11 2018')
            cy.get('.article-content').should('contain', 'Hi')
            cy.get('.tag-list').should('contain', 'tag1')

            cy.get('.card').should('have.length', 3)
            cy.get('.card').eq(1).should('contain', 'First comment')
            cy.get('.card').eq(2).should('contain', 'Second comment')
        })

        it('should allow user to post a comment', function () {
            cy.get('textarea').type('My awesome comment')
            cy.get('button[type=submit]').click()
            cy.get('textarea').should('be.empty')
            cy.contains('My awesome comment').should('exist')
        })

        it('should allow user to delete his comment', function () {
            cy.route('/api/articles/article2-oni8y2/comments', 'fixture:/comments/comments-oni8y2-for-delete.json').as('getArticleComments')
            cy.contains('TO DELETE').should('exist')
            cy.get('.ion-trash-a').click()
            cy.contains('TO DELETE').should('not.exist')
        })
    })

})