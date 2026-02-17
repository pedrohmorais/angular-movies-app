import { Routes } from '@angular/router';
import { APP_ROUTES } from './app.routes.constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.HOME,
    loadChildren: () =>
      import('./features/search/search.routes')
        .then(m => m.SEARCH_ROUTES)
  },
  {
    path: APP_ROUTES.COLLECTIONS,
    loadChildren: () =>
      import('./features/collections/collections.routes')
        .then(m => m.COLLECTIONS_ROUTES)
  },
  {
    path: `${APP_ROUTES.MOVIE_DETAILS}/:movieId`,
    loadComponent: () =>
      import('./features/movie-details/movie-details.component')
        .then(m => m.MovieDetailsComponent)
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.HOME
  }
];
