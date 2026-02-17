import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  template: `
    <h1>My Collections</h1>
    <button mat-raised-button color="primary" routerLink="/collections/create">
      Create Collection
    </button>
  `,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class CollectionsPage {}
