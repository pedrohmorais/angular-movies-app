// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- Command to setup API mocks --
Cypress.Commands.add('mockMovieApis', () => {
  // Mock search movies
  cy.intercept('GET', /api\.themoviedb\.org.*search\/movie/, (req) => {
    req.reply({
      statusCode: 200,
      body: {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: "/fDzVv3SPGEVNuB6d2Gx6ij0d13D.jpg",
            genre_ids: [28, 80, 18],
            id: 155,
            original_language: "en",
            original_title: "The Dark Knight",
            overview: "When the menace known as the Joker wreaks havoc...",
            popularity: 65.5,
            poster_path: "/1hqwGsNuBdAfThvV4Dani97QIOd.jpg",
            release_date: "2008-07-18",
            title: "The Dark Knight",
            video: false,
            vote_average: 9.0,
            vote_count: 28000
          },
          {
            adult: false,
            backdrop_path: "/7f7AKd2rXD9D4H1qYQZQLEWeW4I.jpg",
            genre_ids: [28, 80, 18],
            id: 272,
            original_language: "en",
            original_title: "Batman Begins",
            overview: "Driven by tragedy, billionaire Bruce Wayne...",
            popularity: 45.3,
            poster_path: "/ekZobS8isE6mA6XyEF9M5p5Yjxs.jpg",
            release_date: "2005-06-15",
            title: "Batman Begins",
            video: false,
            vote_average: 8.3,
            vote_count: 19500
          },
          {
            adult: false,
            backdrop_path: "/nM8xDwcXqiMjw7jzs4Jnainj4QA.jpg",
            genre_ids: [28, 80, 18],
            id: 49026,
            original_language: "en",
            original_title: "The Dark Knight Rises",
            overview: "Following the death of District Attorney Harvey Dent...",
            popularity: 38.7,
            poster_path: "/hr0L2dMmB1N1WuNnwBkIclzYYeU.jpg",
            release_date: "2012-07-20",
            title: "The Dark Knight Rises",
            video: false,
            vote_average: 8.5,
            vote_count: 17000
          },
          {
            adult: false,
            backdrop_path: "/or06FN3Dka5tukK1e9fYagTawi5.jpg",
            genre_ids: [28, 12],
            id: 76341,
            original_language: "en",
            original_title: "Batman v Superman: Dawn of Justice",
            overview: "Fearing the actions of a god-like Super-Hero...",
            popularity: 42.1,
            poster_path: "/cUBvescbnehrUntsymp5q51XQrC.jpg",
            release_date: "2016-03-25",
            title: "Batman v Superman: Dawn of Justice",
            video: false,
            vote_average: 6.2,
            vote_count: 13000
          }
        ],
        total_pages: 12,
        total_results: 284
      }
    });
  }).as('searchMovies');

  // Mock guest session
  cy.intercept(/api\.themoviedb\.org.*guest_session\/new/, {
    statusCode: 200,
    body: {
      success: true,
      guest_session_id: "e07e15f6f2a5fdf82c4e5d5f7a6b8c9d"
    }
  }).as('guestSession');

  // Mock movie details
  cy.intercept(/api\.themoviedb\.org.*movie\/\d+/, {
    statusCode: 200,
    body: {
      id: 155,
      title: "The Dark Knight",
      overview: "When the menace known as the Joker wreaks havoc...",
      poster_path: "/1hqwGsNuBdAfThvV4Dani97QIOd.jpg",
      release_date: "2008-07-18",
      vote_average: 9.0,
      runtime: 152
    }
  }).as('movieDetails');

  // Mock rating
  cy.intercept('POST', /api\.themoviedb\.org.*movie\/.*\/rating/, {
    statusCode: 200,
    body: { success: true, status_code: 1, status_message: 'Success.' }
  }).as('rateMovie');
});

// -- Commands for authentication --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// -- Command to search movies --
Cypress.Commands.add('searchMovie', (movieName) => {
  cy.get('input[formControlName="searchQuery"]').type(movieName);
  cy.get('button[type="submit"]').click();
});

