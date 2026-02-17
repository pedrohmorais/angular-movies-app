import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../../shared/models';

@Component({
  selector: 'app-collection-card',
  standalone: true,
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

  constructor(private router: Router) {}

  goToDetails(): void {
    this.router.navigate(['/movie-details', this.movie.id]);
  }
}