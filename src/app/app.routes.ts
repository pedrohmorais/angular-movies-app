import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/search/search.routes')
        .then(m => m.SEARCH_ROUTES)
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./features/collections/collections.routes')
        .then(m => m.COLLECTIONS_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
