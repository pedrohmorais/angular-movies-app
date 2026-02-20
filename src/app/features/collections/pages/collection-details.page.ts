import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CollectionsService } from '../services/collections.service';
import { MovieDetailsDialogComponent } from '../../movie-details/movie-details-dialog.component';
import { MovieApiService } from '../../../core/services/movie-api.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import type { Collection, Movie } from '../../../shared/models';

@Component({
  selector: 'app-collection-details-page',
  standalone: true,
  templateUrl: './collection-details.page.html',
  styleUrl: './collection-details.page.scss',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    NavbarComponent
  ]
})
export class CollectionDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionsService = inject(CollectionsService);
  private readonly movieApiService = inject(MovieApiService);
  private readonly dialog = inject(MatDialog);

  collection = signal<Collection | null>(null);
  collectionId: string | null = null;
  isEmpty = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('id');
      if (this.collectionId) {
        this.loadCollection();
      }
    });
  }

  private loadCollection(): void {
    if (!this.collectionId) return;

    const coll = this.collectionsService.getById(this.collectionId);
    this.collection.set(coll);
    this.isEmpty.set(!coll || !coll.movies || coll.movies.length === 0);
  }

  backToCollections(): void {
    this.router.navigate(['/collections']);
  }

  goToSearch(): void {
    this.router.navigate(['/']);
  }

  removeMovie(movieId: number, event: Event): void {
    event.stopPropagation();
    if (!this.collectionId) return;

    if (confirm('Are you sure you want to remove this movie from the collection?')) {
      this.collectionsService.removeMovieFromCollection(this.collectionId, movieId);
      this.loadCollection();
    }
  }

  openMovieDetails(movieId: number): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { movieId }
    });
  }

  getImageUrl(posterPath: string | null | undefined): string {
    if (!posterPath) {
      return 'assets/placeholder.png';
    }
    return this.movieApiService.getImageUrl(posterPath);
  }
}

