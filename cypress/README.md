# Cypress E2E Tests - Angular Movies App

This folder contains end-to-end tests using Cypress for the Angular Movies App.

## Installation

First, install Cypress as a dev dependency:

```bash
npm install --save-dev cypress
```

## Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run e2e:open
# or
cypress open
```

### Run Tests Headless (CI/CD Mode)
```bash
npm run e2e:headless
# or
npm run e2e
# or
cypress run
```

### Run Specific Test File
```bash
cypress run --spec "cypress/e2e/search-batman.cy.ts"
```

## Test Coverage

### search-batman.cy.ts
This test suite focuses on testing the movie search functionality specifically with the term "batman":

#### Tests Included:
1. **Page Load** - Verifies the search page loads with title and subtitle
2. **Search Input** - Validates the search input field is present and has correct attributes
3. **Search Execution** - Tests searching for "batman" and verifying results load
4. **Movie Cards** - Validates that search results display movie cards with proper information
5. **Movie Images** - Checks for movie poster images or placeholder fallbacks
6. **Details Button** - Tests the Details button on movie cards is clickable
7. **Movie Selection** - Verifies multiple movie selection with checkboxes
8. **Form Validation** - Tests input validation for minimum 3 characters
9. **Add to Collection** - Tests the Add to Collection button state changes
10. **Pagination** - Validates pagination controls are present for large result sets
11. **Page Navigation** - Tests navigating between pages of results

## Project Structure

```
cypress/
├── e2e/
│   └── search-batman.cy.ts         # Main test suite for search functionality
├── support/
│   ├── commands.ts                 # Custom Cypress commands
│   └── e2e.ts                      # Cypress support configuration
└── cypress.config.ts               # Cypress configuration file
```

## Configuration

The Cypress configuration is set in `cypress.config.ts`:

- **Base URL**: `http://localhost:4200` (your development server)
- **Viewport**: 1280x720
- **Default Command Timeout**: 10 seconds
- **Request Timeout**: 10 seconds

## Requirements

Before running tests, ensure:
1. The Angular app is running locally (`npm start`)
2. The app is accessible at `http://localhost:4200`
3. The movie API is accessible (required for search functionality)

## Troubleshooting

### Tests fail with connection errors
- Make sure the app is running: `npm start`
- Check that the baseUrl in cypress.config.ts matches your dev server

### API calls timeout
- Verify the movie API endpoint is accessible
- Check network conditions
- Increase timeout values if needed in cypress.config.ts

### No movies found in search
- This depends on the actual TMDb API
- The search for "batman" should return results if the API is working

## CI/CD Integration

To run Cypress in a CI/CD pipeline:

```bash
npm run e2e:headless
```

This runs all tests in headless mode suitable for automated environments.

## Custom Commands

### searchMovie
Custom command to search for a movie:
```typescript
cy.searchMovie('batman');
```

## Notes

- Tests use the custom search validator directive for form validation
- Tests handle Material Design components (mat-card, mat-spinner, mat-paginator, etc.)
- Tests wait for spinners to disappear before checking results
- All selectors use Angular reactive form control names for stability
