import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MovieApiService } from '../../core/services/movie-api.service';
import { MovieDetails } from '../../shared/models';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ]
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: MovieDetails | null = null;
  isLoading = true;
  userRating = 0;
  isRatingSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: number },
    private movieApiService: MovieApiService,
    private dialogRef: MatDialogRef<MovieDetailsComponent>
  ) {}

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  private loadMovieDetails(): void {
    this.movieApiService.getMovieDetails(this.data.movieId)
      .subscribe({
        next: (details) => {
          this.movieDetails = details;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do filme:', error);
          this.isLoading = false;
        }
      });
  }

  onRateMovie(): void {
    if (!this.movieDetails || this.userRating === 0) {
      return;
    }

    this.movieApiService.getSessionId()
      .subscribe({
        next: (sessionResponse) => {
          this.movieApiService.rateMovie(
            this.movieDetails!.id,
            this.userRating,
            sessionResponse.guest_session_id
          ).subscribe({
            next: () => {
              this.isRatingSubmitted = true;
              setTimeout(() => {
                this.dialogRef.close();
              }, 1500);
            },
            error: (error) => {
              console.error('Erro ao avaliar filme:', error);
            }
          });
        },
        error: (error) => {
          console.error('Erro ao obter sessão:', error);
        }
      });
  }

  getImageUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/placeholder.png';
    }
    return this.movieApiService.getImageUrl(posterPath);
  }

  getLanguagesText(): string {
    if (!this.movieDetails || !this.movieDetails.spoken_languages) {
      return 'Não disponível';
    }
    return this.movieDetails.spoken_languages
      .map(lang => lang.name)
      .join(', ') || 'Não disponível';
  }

  formatCurrency(value: number): string {
    if (value === 0) return 'Não disponível';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}
