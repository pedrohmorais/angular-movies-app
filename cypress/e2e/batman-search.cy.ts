describe('Movie Search with API Mocks', () => {
  beforeEach(() => {
    // Mock search movies endpoint
    cy.intercept('GET', '**/search/movie*', {
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
            overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests to fight injustice.",
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
            overview: "Driven by tragedy, billionaire Bruce Wayne dedicated his life to uncovering and defeating the source of crime in Gotham.",
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
            overview: "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to maintain the hope Batman brought to Gotham.",
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
            overview: "Fearing the actions of a god-like Super-Hero left unchecked, Gotham's own formidable, forceful vigilante takes on Metropolis's most powerful, collossus meta-human.",
            popularity: 42.1,
            poster_path: "/cUBvescbnehrUntsymp5q51XQrC.jpg",
            release_date: "2016-03-25",
            title: "Batman v Superman: Dawn of Justice",
            video: false,
            vote_average: 6.2,
            vote_count: 13000
          },
          {
            adult: false,
            backdrop_path: "/yF1eUahaVeqeNpI3V0DRr6iMaDJ.jpg",
            genre_ids: [28, 80, 18],
            id: 278,
            original_language: "en",
            original_title: "Batman",
            overview: "The Dark Knight of Gotham City begins his war on crime with his first major enemy being the clownishly homicidal Joker, who constantly plagues Gotham City to the limits.",
            popularity: 28.5,
            poster_path: "/cSLHSGF1_UzFtsSysCQjxwj6gG9.jpg",
            release_date: "1989-06-23",
            title: "Batman",
            video: false,
            vote_average: 7.5,
            vote_count: 10000
          },
          {
            adult: false,
            backdrop_path: "/gYhbsfJ7uDdIVyE6CzKq5XcaYHF.jpg",
            genre_ids: [28, 12, 80],
            id: 207703,
            original_language: "en",
            original_title: "The LEGO Batman Movie",
            overview: "A new mysterious villain covers Gotham with a shadowy substance and things go haywire throughout the caped crusader's turf.",
            popularity: 32.8,
            poster_path: "/7fs53rFvQdyKuPkGv02hWbB7X1I.jpg",
            release_date: "2017-02-10",
            title: "The LEGO Batman Movie",
            video: false,
            vote_average: 7.3,
            vote_count: 8500
          }
        ],
        total_pages: 12,
        total_results: 284
      }
    }).as('searchMovies');

    // Mock guest session endpoint
    cy.intercept('GET', '**/authentication/guest_session/new*', {
      statusCode: 200,
      body: { 
        success: true, 
        guest_session_id: "e07e15f6f2a5fdf82c4e5d5f7a6b8c9d" 
      }
    }).as('guestSession');

    // Mock movie details endpoint
    cy.intercept('GET', '**/movie/155*', {
      statusCode: 200,
      body: {
        adult: false,
        backdrop_path: "/fDzVv3SPGEVNuB6d2Gx6ij0d13D.jpg",
        belongs_to_collection: {
          id: 263462,
          name: "The Dark Knight Collection",
          poster_path: "/tzjWQrcVt228G8oYGJDHvM0dLgg.jpg",
          backdrop_path: "/fDzVv3SPGEVNuB6d2Gx6ij0d13D.jpg"
        },
        budget: 185000000,
        genres: [
          { id: 28, name: "Action" },
          { id: 80, name: "Crime" },
          { id: 18, name: "Drama" }
        ],
        homepage: "https://www.warnerbros.com/movies/dark-knight",
        id: 155,
        imdb_id: "tt0468569",
        original_language: "en",
        original_title: "The Dark Knight",
        overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests to fight injustice.",
        popularity: 65.5,
        poster_path: "/1hqwGsNuBdAfThvV4Dani97QIOd.jpg",
        release_date: "2008-07-18",
        revenue: 1005064347,
        runtime: 152,
        status: "Released",
        tagline: "Why So Serious?",
        title: "The Dark Knight",
        video: false,
        vote_average: 9.0,
        vote_count: 28000,
        videos: { results: [] }
      }
    }).as('movieDetails');

    // Mock rating endpoint
    cy.intercept('POST', '**/movie/*/rating*', {
      statusCode: 200,
      body: { 
        success: true, 
        status_code: 1, 
        status_message: 'Success.' 
      }
    }).as('rateMovie');
    
    // Visit the application after setting up all intercepts
    cy.visit('http://localhost:4200/');
  });

  it('should load the search page successfully', () => {
    cy.contains('h1', 'Discover Movies').should('be.visible');
    cy.contains('p', 'Search for your favorite movies').should('be.visible');
  });

  it('should display the search input field', () => {
    cy.get('input[formControlName="searchQuery"]').should('be.visible');
    cy.get('input[formControlName="searchQuery"]')
      .should('have.attr', 'placeholder', 'Type the movie name...');
  });

  it('should search for movies and receive mocked results', () => {
    cy.get('input[formControlName="searchQuery"]').type('batman');
    cy.get('input[formControlName="searchQuery"]').should('have.value', 'batman');
    
    // Wait for the mocked API call
    cy.wait('@searchMovies', { timeout: 10000 });
  });

  it('should accept a 3-character search', () => {
    cy.get('input[formControlName="searchQuery"]').type('bat');
    cy.get('input[formControlName="searchQuery"]').should('have.value', 'bat');
    cy.wait('@searchMovies', { timeout: 10000 });
  });
});
