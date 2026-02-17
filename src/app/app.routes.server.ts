import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'collections',
    renderMode: RenderMode.Server
  },
  {
    path: 'collections/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'collections/create',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
