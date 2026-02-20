# Cypress API Mocks Setup Guide

## Overview
This guide explains how the Cypress tests are configured with mocked API responses for The Movie Database (TMDb) API calls.

## Problem
The original Cypress tests were trying to make real HTTP requests to the TMDb API, which resulted in:
- Attempts to reach external APIs (api.themoviedb.org)
- Failed tests due to network issues or API key problems
- Unreliable test execution

## Solution
We've implemented `cy.intercept()` to mock all API calls that the application makes. This allows tests to:
- Run without external dependencies
- Execute quickly and reliably
- Control the exact data returned by APIs
- Test both success and error scenarios

## Mocked API Endpoints

### 1. Search Movies
**Endpoint:** `GET /search/movie`
**Mocked in:** `cypress/e2e/simple-search.cy.ts`, `cypress/e2e/debug-mocks.cy.ts`

Returns a list of Batman-related movies with properties like:
- `id`: Unique movie identifier
- `title`: Movie title
- `poster_path`: Path to poster image
- `release_date`: Release date
- `vote_average`: Rating (0-10)
- `overview`: Movie description
- And other standard TMDb fields

### 2. Guest Session Creation
**Endpoint:** `GET /authentication/guest_session/new`
**Purpose:** Creates a guest session for rating movies
**Mock Response:**
```json
{
  "success": true,
  "guest_session_id": "e07e15f6f2a5fdf82c4e5d5f7a6b8c9d"
}
```

### 3. Movie Details
**Endpoint:** `GET /movie/{id}`
**Purpose:** Fetches detailed information about a specific movie
**Contains:** Title, overview, runtime, videos, and more

### 4. Rate Movie
**Endpoint:** `POST /movie/{id}/rating`
**Purpose:** Submits a user's movie rating (usually 1-10)
**Mock Response:**
```json
{
  "success": true,
  "status_code": 1,
  "status_message": "Success."
}
```

## How Intercepts Work

All intercepts must be set up **BEFORE** visiting the page:

```typescript
beforeEach(() => {
  // 1. Set up all cy.intercept() calls FIRST
  cy.intercept('GET', '**/search/movie*', {
    statusCode: 200,
    body: { /* mock data */ }
  }).as('searchMovies');

  // 2. THEN visit the page
  cy.visit('http://localhost:4200/');
});
```

## Best Practices

1. **Order Matters**: Always call `cy.intercept()` BEFORE `cy.visit()` 
2. **Use Descriptive Aliases**: Use `.as('searchMovies')` to label intercepts
3. **Match URL Patterns**: Use wildcards `**/search/movie*` for flexible matching
4. **Wait for Intercepts**: Use `cy.wait('@searchMovies')` to synchronize tests with API calls
5. **Mock Complete Responses**: Include all fields the component expects

## Running Mocked Tests

```bash
# Run all tests with mocks
npm run e2e

# Run a specific mock test file
npm run e2e -- --spec "cypress/e2e/simple-search.cy.ts"

# Run in headed mode (see browser)
npm run e2e -- --headed

# Run with video recording
npm run e2e --record
```

## Test Files

- **`cypress/e2e/simple-search.cy.ts`** - Basic mocked search tests (recommended starting point)
- **`cypress/e2e/debug-mocks.cy.ts`** - Debug test for verifying intercept setup
- **`cypress/e2e/search-with-mocks.cy.ts`** - Comprehensive mocked tests
- **`cypress/e2e/test-simplified.cy.ts`** - Simplified mocked tests

## Important Notes

- The application uses a 500ms debounce on search input before making API calls
- Tests must wait for this debounce + the mocked API response
- Timeout for API waits should be at least 10000ms (10 seconds) to account for all delays
- Mocks are isolated per test file and don't affect the actual API

## To Add New Mocks

1. Identify the API endpoint being called by the component
2. Use `cy.intercept('METHOD', '**/endpoint*', mockResponse)` to mock it
3. Set up the intercept in `beforeEach()` BEFORE visiting the page
4. Use the alias (`.as()`) to wait for it with `cy.wait()`

## Troubleshooting

**Tests timing out waiting for API:**
- Increase timeout: `cy.wait('@alias', { timeout: 15000 })`
- Check if the intercept pattern matches the actual URL
- Verify the component is triggering the API call (check console logs)

**Mocks not being intercepted:**
- Make sure intercepts are set up BEFORE `cy.visit()`
- Check the URL pattern with `cy.log()`
- Verify the HTTP method (GET vs POST)

**Component not updating with mock data:**
- Ensure mock response includes all required fields
- Check that response structure matches TMDb API format
- Verify the HTTP status code is 200

## References

- [Cy.intercept() Documentation](https://docs.cypress.io/api/commands/intercept)
- [Waiting for Intercepts](https://docs.cypress.io/api/commands/wait)
- [TMDb API Documentation](https://developer.themoviedb.org/3)
