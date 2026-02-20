# Cypress E2E Testing Setup Guide

## Overview
Cypress end-to-end tests have been created for testing the movie search functionality (searching for "batman"). The complete test suite includes 11 comprehensive test cases.

## Files Created

```
cypress/
├── e2e/
│   └── search-batman.cy.ts          # Main test suite for search (11 tests)
├── support/
│   ├── commands.ts                  # Custom Cypress commands
│   └── e2e.ts                       # Support file configuration
├── tsconfig.json                    # TypeScript configuration for Cypress
├── .gitignore                       # Ignore unnecessary files
└── README.md                        # Cypress documentation

Root level:
├── cypress.config.ts                # Cypress configuration
└── package.json                     # Updated with Cypress scripts and dependencies
```

## Installation Steps

### 1. Install Cypress
Since the PowerShell execution policy is blocking npm, use an unrestricted terminal (Git Bash, WSL, or CMD without execution policy):

```bash
npm install --save-dev cypress
```

Or manually edit `package.json` and run `npm install` in an unrestricted environment.

### 2. Verify Installation
```bash
npx cypress --version
```

## Running the Tests

### Option 1: Interactive Mode (Recommended for Development)
```bash
npm run e2e:open
```
This opens the Cypress Test Runner UI where you can:
- See all test files
- Run individual tests
- Watch tests execute in real-time
- Debug failures with Chrome DevTools

### Option 2: Headless Mode (CI/CD)
```bash
npm run e2e:headless
```
Runs all tests in the background without UI.

### Option 3: Run Specific Test File
```bash
cypress run --spec "cypress/e2e/search-batman.cy.ts"
```

## Test Suite Details: search-batman.cy.ts

This test file contains 11 comprehensive tests for movie search functionality:

### Tests Included:

1. **should load the search page successfully**
   - Verifies page title "Discover Movies" is visible
   - Checks subtitle "Search for your favorite movies" is present

2. **should display the search input field**
   - Validates search input with formControlName="searchQuery"
   - Checks correct placeholder text

3. **should search for batman and display results**
   - Types "batman" in search field
   - Triggers search with Enter key
   - Waits for loading spinner to disappear
   - Verifies results grid is visible
   - Checks at least one movie card is displayed

4. **should display batman movie cards with correct information**
   - Searches for batman
   - Verifies each card contains:
     - Movie title
     - Release year
     - Rating badge

5. **should display movie poster images or placeholder**
   - Searches for batman
   - Validates movie cards have images or no-image placeholders

6. **should allow interaction with search results - Details button**
   - Searches for batman
   - Verifies Details button is visible and clickable
   - Ensures button is not disabled

7. **should allow selecting multiple movies**
   - Searches for batman
   - Selects first two movies via checkboxes
   - Verifies chip shows "2 selected"

8. **should display error message for empty search**
   - Attempts empty search submission
   - Validates error handling
   - Checks input is marked invalid

9. **should validate minimum 3 characters requirement**
   - Types "ba" (less than 3 characters)
   - Verifies error message appears
   - Checks input is marked invalid

10. **should show "Add to Collection" button when movies are selected**
    - Verifies button is disabled initially
    - Selects a movie
    - Confirms button becomes enabled

11. **should display pagination controls for large result sets**
    - Searches for batman
    - Validates pagination element is visible
    - Tests navigation to next page

## Before Running Tests

Ensure your environment is set up:

1. **Start the development server:**
   ```bash
   npm start
   ```
   The app should be accessible at `http://localhost:4200`

2. **Verify API connectivity:**
   - The test depends on the TMDb API being configured
   - Ensure your API key is properly set up in the application

3. **Install Cypress:**
   ```bash
   npm install --save-dev cypress
   ```

## Configuration Details

**cypress.config.ts**:
- Base URL: `http://localhost:4200`
- Viewport: 1280x720 (optimized for most screens)
- Command Timeout: 10 seconds
- Request Timeout: 10 seconds

These can be adjusted if tests are timing out or if you need different settings.

## Custom Commands

Available custom commands in `cypress/support/commands.ts`:

```typescript
// Search for a movie
cy.searchMovie('batman');

// Login (placeholder for future authentication tests)
cy.login(email, password);
```

## Troubleshooting

### Issue: "Cannot find module 'cypress'"
**Solution**: Install Cypress in an unrestricted terminal environment
```bash
npm install --save-dev cypress
```

### Issue: Tests fail with connection errors
**Solution**: 
- Ensure `npm start` is running
- Check that `http://localhost:4200` is accessible
- Verify firewall settings

### Issue: "No movies found" in search results
**Solution**:
- Verify the TMDb API key is configured in the app
- Check network tab in DevTools for API errors
- Ensure API endpoints are accessible

### Issue: Tests timeout waiting for results
**Solution**:
- Increase timeout in `cypress.config.ts` (defaultCommandTimeout, requestTimeout)
- Check API response times
- Verify network connectivity

## Continuous Integration

To run tests in CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```bash
npm install
npm start &  # Start app in background
npm run e2e:headless  # Run tests headless
```

## Next Steps

After confirming these basic tests work:

1. **Add more test scenarios:**
   - Test invalid search inputs
   - Test collection management
   - Test movie details dialog
   - Test pagination

2. **Implement page objects:**
   - Create page object models for better maintainability
   - Centralize selectors and actions

3. **Add fixtures:**
   - Mock API responses for consistent testing
   - Create test data factories

4. **Performance testing:**
   - Add performance benchmarks
   - Monitor API response times

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Angular + Cypress](https://docs.cypress.io/guides/tooling/angular)
- [Testing Material Components](https://material.angular.io/guide/using-component-harnesses)

## Notes

- ✅ Tests are framework-agnostic and work with Angular Material
- ✅ Tests use proper waits for async operations
- ✅ Tests validate user interactions, not implementation details
- ✅ Tests are reproducible and isolated
- ✅ All selectors use stable form control names, not HTML structure

---

**Created:** February 19, 2026
**Test Focus:** Movie search functionality with "batman" keyword
**Status:** Ready for installation and execution
