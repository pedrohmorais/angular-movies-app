import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CollectionsService } from '../services/collections.service';
import type { Collection } from '../../../shared/models';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  templateUrl: './collections.page.html',
  styleUrl: './collections.page.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class CollectionsPage implements OnInit {
  collections = signal<Collection[]>([]);
  isEmpty = signal(true);

  constructor(
    private collectionsService: CollectionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  private loadCollections(): void {
    const collections = this.collectionsService.getAll();
    this.collections.set(collections);
    this.isEmpty.set(collections.length === 0);
  }

  createCollection(): void {
    this.router.navigate(['/collections/create']);
  }

  viewCollection(collectionId: string): void {
    this.router.navigate(['/collections', collectionId]);
  }

  deleteCollection(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this collection?')) {
      this.collectionsService.delete(id);
      this.loadCollections();
    }
  }

  getMovieCount(collection: Collection): number {
    return collection.movies?.length || 0;
  }
}

