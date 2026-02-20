# Angular Movies App

A modern, scalable web application for discovering, managing, and organizing movies with a focus on user experience and clean code architecture.

## Business Overview

### Purpose
The Angular Movies App is a movie discovery and collection management platform that allows users to:
- **Search movies** in a comprehensive database (TheMovieDB)
- **View detailed information** about films including ratings, release dates, and descriptions
- **Create custom collections** to organize favorite movies by themes or preferences
- **Rate and review** movies within personal collections
- **Persistent storage** of collections using browser localStorage for seamless experience across sessions

### Target Users
- Movie enthusiasts who want to organize and manage their favorite films
- Cinephiles seeking detailed movie information
- Users building personal movie libraries and recommendations

### Key Business Features
1. **Movie Discovery** - Search and browse millions of movies
2. **Collection Management** - Create, edit, and delete custom movie collections
3. **Detailed Information** - Access comprehensive movie metadata (director, cast, budget, revenue, etc.)
4. **Rating System** - Rate movies on TheMovieDB platform through the app
5. **Session Persistence** - Automatic saving of user collections in browser storage

### Value Proposition
- **Zero Backend Required** - Client-side storage means no server maintenance costs
- **Real-time Data** - Direct integration with TheMovieDB ensures fresh, accurate movie information
- **User Control** - Complete control over personal data and collections
- **Offline Capable** - Collections remain accessible even without internet (read-only after initial load)

---

## Code Overview

### Technology Stack

```
Frontend Framework:    Angular 21.1.0 (Latest)
Language:             TypeScript 5.9.2 (Strict mode)
UI Components:        Angular Material 21.1.4
State Management:     Angular Signals (Reactive)
HTTP Client:          Angular HttpClientModule
Forms:               Reactive Forms (FormBuilder, Validators)
Styling:             SCSS with Prettier formatting
Testing (Unit):       Jasmine + Karma
Testing (E2E):       Cypress 13.6.0
API Integration:     TheMovieDB REST API v3
Data Persistence:    Browser localStorage
Routing:             Angular Router with lazy-loading
Build Tool:          Vite + Angular CLI
```

### Core Modules & Services

#### **API Service Layer** (`src/app/core/services/`)
- **MovieApiService** - Centralized gateway for all TheMovieDB interactions
  - `searchMovies(query, page)` - Search movie database
  - `getMovieDetails(movieId)` - Fetch full movie metadata
  - `createGuestSession()` - Initialize guest rating session
  - `rateMovie(movieId, sessionId, rating)` - Submit movie ratings
  - Implements error handling and HTTP interceptors

- **SessionService** - Manages guest user sessions
- **RatingService** - Rate synchronization with TheMovieDB

#### **Feature Modules** (`src/app/features/`)

**Search Module** (`search/`)
- SearchPage component with debounced input (500ms)
- Real-time search results with pagination
- Movie card display with poster images
- Input validation (minimum 3 characters)
- Lazy-loaded from main route

**Collections Module** (`collections/`)
- CollectionsPage - List all user collections
- AddToCollectionDialog - Add movies to collections
- CollectionsService - localStorage-based collection persistence
- Duplicate detection (avoid adding same movie twice)

**Movie Details Module** (`movie-details/`)
- MovieDetailsDialogComponent - Full movie information modal
- Shows: Title, release date, budget, revenue, runtime, rating, overview
- OnPush change detection for performance
- Integrated rating submission

**Layout Module** (`layout/`)
- MainLayoutComponent - Application shell with responsive sidenav
- NavbarComponent - Navigation header with branding

#### **Shared Components** (`src/app/shared/`)
- **material.module.ts** - Centralized Material module exports (tree-shaking optimized)
- **SearchValidatorDirective** - Real-time search input validation
- **Models** - TypeScript interfaces for type safety:
  - `Movie`, `MovieDetails`, `Collection`, `MovieResponse`

### Design Patterns & Best Practices

#### **Standalone Components**
All components are standalone (Angular 17+ standard):
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule, ...],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
```

#### **Reactive Forms**
Strong typing with form groups:
```typescript
searchForm: FormGroup = this.fb.group({
  query: ['', [Validators.required, Validators.minLength(3)]]
});
```

#### **Angular Signals (State Management)**
Modern reactive state without RxJS boilerplate:
```typescript
collections = signal<Collection[]>([]);
isEmpty = signal(true);
movieDetails = signal<MovieDetails | null>(null);
```

#### **Change Detection Strategy**
- Default strategy on SearchPage (frequent input changes)
- OnPush on MovieDetailsDialogComponent (performance optimization)

#### **HTTP Interceptors**
```
api-key.interceptor.ts    - Automatic API key injection in requests
error.interceptor.ts      - Global error handling and logging
```

#### **Lazy Loading**
- Search routes in separate chunk (~23 kB)
- Collections routes in separate chunk (~32 kB)
- Main bundle: ~329 kB initial, optimized for first paint

---

## Architecture

### Application Structure

```
src/
├── app/
│   ├── core/                    # Singleton services & interceptors
│   │   ├── interceptors/
│   │   │   ├── api-key.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── services/
│   │       ├── movie-api.service.ts
│   │       ├── rating.service.ts
│   │       └── session.service.ts
│   │
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── search/
│   │   │   ├── search.page.ts
│   │   │   ├── search.routes.ts
│   │   │   └── search.page.html
│   │   │
│   │   ├── collections/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── collections.routes.ts
│   │   │
│   │   ├── movie-details/
│   │   │   └── movie-details-dialog.component.ts
│   │   │
│   │   └── layout/
│   │       └── main-layout.component.ts
│   │
│   ├── shared/                  # Reusable across features
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── pagination/
│   │   │   └── confirm-dialog/
│   │   ├── directives/
│   │   │   └── search-validator.directive.ts
│   │   ├── models/
│   │   │   └── *.model.ts
│   │   └── material/
│   │       └── material.module.ts     # Centralized Material exports
│   │
│   ├── app.ts                   # Root component
│   ├── app.routes.ts           # Main routing configuration
│   └── app.config.ts           # DI configuration
│
├── environments/
│   ├── environment.ts          # Development config
│   └── environment.prod.ts     # Production config
│
└── styles.scss                 # Global SCSS
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interface (UI)                         │
│  ┌──────────────────┐         ┌──────────────────────────────┐  │
│  │  Search Input    │────────▶│  Debounced Search (500ms)    │  │
│  └──────────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Components (Reactive/Standalone)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ SearchPage (Signals + Reactive Forms)                      │ │
│  │ ├─ movieApiService.searchMovies()                          │ │
│  │ └─ Display results with pagination                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│           Services (Dependency Injection)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ MovieApiService                                            │ │
│  │ ├─ HTTP Requests → TheMovieDB API                          │ │
│  │ ├─ Response Transformation (RxJS Operators)                │ │
│  │ └─ Error Handling (catchError, retry)                      │ │
│  │                                                             │ │
│  │ CollectionsService                                         │ │
│  │ ├─ localStorage Read/Write                                 │ │
│  │ └─ Collection Management Logic                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
        ┌──────────────────────┐        ┌──────────────────────┐
        │  TheMovieDB API v3   │        │  Browser Storage     │
        │  - Search            │        │  (localStorage)      │
        │  - Movie Details     │        │  - Collections       │
        │  - Ratings           │        │  - Session Data      │
        └──────────────────────┘        └──────────────────────┘
```

### State Management Strategy

**Signals-Based Pattern:**
```typescript
// Component-level reactive state
collections = signal<Collection[]>([]);
isLoading = signal(false);
selectedMovies = signal<Set<number>>(new Set());

// Automatic change detection triggers when signals update
ngOnInit() {
  this.loadCollections();
  this.isEmpty.set(this.collections().length === 0);
}
```

**Service-Level Persistence:**
```typescript
// Collections stored in localStorage
addMovieToCollection(collectionId: string, movie: Movie): void {
  const collections = this.getAll();
  // ... mutation logic
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
}
```

### API Integration Strategy

**Single Responsibility Principle:**
```typescript
// MovieApiService handles ONLY API communication
get movieDetails(): Observable<MovieDetails> {
  return this.movieApiService.getMovieDetails(movieId).pipe(
    takeUntil(this.destroy$),
    catchError(error => {
      console.error('Failed to load movie:', error);
      return of(null);
    })
  );
}
```

**HTTP Interceptors Chain:**
1. **api-key.interceptor** - Injects TMDB API key into all requests
2. **error.interceptor** - Catches and logs HTTP errors globally

### Routing Architecture

```
/
├── (main layout with sidenav)
│   ├── /search
│   │   └── Search/Discover movies (lazy-loaded)
│   │
│   └── /collections
│       ├── View all collections (lazy-loaded)
│       ├── /collections/:id
│       │   └── Collection details
│       └── /collections/:id/details/:movieId
│           └── Movie details within collection
```

---

## Performance Optimizations

### Bundle Size Management
- **Lazy-loaded routes**: Search (~23 kB) and Collections (~32 kB) in separate chunks
- **Tree-shaking**: Material modules consolidated in barrel export for dead code elimination
- **OnPush change detection**: Used where appropriate to reduce change detection cycles
- **Debounced search**: 500ms debounce prevents excessive API calls

### Network Optimization
- **HTTP caching**: Search results could be cached (future implementation)
- **Paginated results**: 10 movies per page reduces data transfer
- **Image optimization**: TheMovieDB serves optimized poster images
- **API interceptors**: Automatic key injection reduces boilerplate

### Memory Management
- **Unsubscribe pattern**: `takeUntil(destroy$)` prevents memory leaks
- **Signal usage**: More memory-efficient than RxJS-only approach
- **Lazy-loaded components**: Collections, search modules load only when needed

---

## Testing Strategy

### E2E Tests (Cypress)
```bash
npm run e2e              # Run all E2E tests
npm run e2e:open        # Launch Cypress UI
```

**Key test suites:**
- **batman-search.cy.ts** - Search functionality with API mocks
  - Page load testing
  - Search input validation (3-char minimum)
  - Pagination functionality
  - Mock API intercepts

**API Mocking:**
- Uses `cy.intercept()` to mock TheMovieDB endpoints
- Realistic response fixtures in `cypress/fixtures/`
- No external dependencies required for tests

### Unit Tests (Jasmine + Karma)
```bash
npm run test            # Run unit tests
```

Current coverage includes:
- MainLayoutComponent
- MovieDetailsDialogComponent
- Collections service tests

---

## Environment Configuration

### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  api: {
    baseUrl: 'https://api.themoviedb.org/3',
    apiKey: '[YOUR_API_KEY]',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
  }
};
```

### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  api: {
    baseUrl: 'https://api.themoviedb.org/3',
    apiKey: '', // Should be injected via CI/CD or backend proxy
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
  }
};
```

**Security Note:** In production, consider proxying API calls through your backend to avoid exposing API keys in client code.

---

## Getting Started

### Prerequisites
- Node.js 20.20.0 or higher
- npm 11.10.0 or higher
- TheMovieDB API Key (free at https://www.themoviedb.org/settings/api)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd angular-movies-app

# Install dependencies
npm install

# Set API key in environment.ts
# Edit src/environments/environment.ts with your TheMovieDB API key
```

### Development Server

```bash
npm run start
# Navigate to http://localhost:4200/
```

### Build for Production

```bash
npm run build
# Output: dist/angular-movies-app/
```

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run e2e

# E2E with UI
npm run e2e:open
```

---

## Code Quality Standards

### Angular Best Practices
- ✅ Standalone components (Angular 17+)
- ✅ Reactive Forms with strong typing
- ✅ OnPush change detection strategy
- ✅ Signals for state management
- ✅ Lazy-loaded feature routes
- ✅ Proper dependency injection

### TypeScript Configuration
- ✅ Strict mode enabled
- ✅ No implicit any
- ✅ Null safety checks
- ✅ Interface-based contracts

### Code Organization
- ✅ Barrel exports (index.ts) for clean imports
- ✅ Service consolidation (material.module.ts)
- ✅ Separation of concerns
- ✅ SCSS modules for style scoping

---

## Future Enhancements

1. **Caching Layer** - Cache popular searches to reduce API calls
2. **Recommendations** - Suggest movies based on user ratings
3. **Backend Integration** - Replace localStorage with server persistence
4. **Social Features** - Share collections with other users
5. **Advanced Filters** - Filter by genre, year, ratings
6. **Dark Mode** - Theme switcher for user preferences
7. **Offline Support** - Service Worker for offline access
8. **Analytics** - Track user behavior and popular searches

---

## Support & Documentation

- **TheMovieDB API Docs**: https://developer.themoviedb.org/docs
- **Angular Documentation**: https://angular.dev
- **Angular Material**: https://material.angular.io

---

## License

This project is open source and available under the MIT License.

---

**Last Updated**: February 20, 2026  
**Angular Version**: 21.1.0  
**TypeScript Version**: 5.9.2
