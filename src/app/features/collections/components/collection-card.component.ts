import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Movie } from '../../../shared/models';
import { MovieDetailsDialogComponent } from '../../movie-details/movie-details-dialog.component';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [],
  template: `
    <div class="movie-card" (click)="goToDetails()">
      <img [src]="movie.poster_path" alt="{{ movie.title }} poster" />
      <h3>{{ movie.title }}</h3>
    </div>
  `,
  styles: [
    `
      .movie-card {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .movie-card img {
        width: 100%;
        max-width: 200px;
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .movie-card h3 {
        font-size: 1.2rem;
        margin: 0;
      }
    `
  ]
})
export class CollectionCardComponent {
  @Input() movie!: Movie;

  private readonly dialog = inject(MatDialog);

  goToDetails(): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { movieId: this.movie.id }
    });
  }
}
