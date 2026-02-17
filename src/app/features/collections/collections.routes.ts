import { Routes } from '@angular/router';
import { CollectionsPage } from './pages/collections.page';
import { CollectionDetailsPage } from './pages/collection-details.page';
import { CollectionCreatePage } from './pages/collection-create.page';

export const COLLECTIONS_ROUTES: Routes = [
  {
    path: '',
    component: CollectionsPage
  },
  {
    path: 'create',
    component: CollectionCreatePage
  },
  {
    path: ':id',
    component: CollectionDetailsPage
  }
];
