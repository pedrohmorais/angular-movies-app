import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

import { MovieApiService } from '../../core/services/movie-api.service';
import { MovieDetails } from '../../shared/models';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ]
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movieDetails = signal<MovieDetails | null>(null);
  isLoading = signal(true);
  userRating = signal(0);
  isRatingSubmitted = signal(false);

  private destroy$ = new Subject<void>();

  constructor(
    private movieApiService: MovieApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(paramMap => {
        const movieId = paramMap.get('movieId');
        if (movieId) {
          this.loadMovieDetails(+movieId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMovieDetails(movieId: number): void {
    this.isLoading.set(true);
    this.movieApiService.getMovieDetails(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.movieDetails.set(details);
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do filme:', error);
          this.isLoading.set(false);
          this.cdr.markForCheck();
        }
      });
  }

  getImageUrl(posterPath: string | null | undefined): string {
    if (!posterPath) {
      return 'assets/placeholder.png';
    }
    return this.movieApiService.getImageUrl(posterPath);
  }

  getLanguagesText(): string {
    const details = this.movieDetails();
    if (!details || !details.spoken_languages) {
      return 'Não disponível';
    }
    return details.spoken_languages
      .map(lang => lang.name)
      .join(', ') || 'Não disponível';
  }

  formatCurrency(value: number | undefined): string {
    if (!value || value === 0) return 'Não disponível';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}
