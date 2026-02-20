describe('Batman Search API Mocks - Debug', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/search/movie*', {
      statusCode: 200,
      body: {
        page: 1,
        results: [
          {
            id: 155,
            title: "The Dark Knight",
            poster_path: "/1hqwGsNuBdAfThvV4Dani97QIOd.jpg",
            release_date: "2008-07-18",
            vote_average: 9.0,
            overview: "Batman movie",
            adult: false,
            genre_ids: [28],
            original_title: "The Dark Knight"
          }
        ],
        total_pages: 1,
        total_results: 1
      }
    }).as('searchAPI');

    cy.visit('http://localhost:4200/');
    cy.contains('Discover Movies').should('exist');
  });

  it('Should intercept and mock search calls', () => {
    cy.log('Test starting');
    
    cy.get('input[formControlName="searchQuery"]')
      .should('be.visible')
      .type('batman');
    
    cy.log('Batman typed, checking input value');
    cy.get('input[formControlName="searchQuery"]').should('have.value', 'batman');
    
    cy.log('Waiting for search API...');
    cy.wait('@searchAPI', { timeout: 10000 });
    
    cy.log('API call intercepted, test complete');
  });
});
