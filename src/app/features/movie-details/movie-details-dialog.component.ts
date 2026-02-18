import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MovieApiService } from '../../core/services/movie-api.service';
import { MovieDetails } from '../../shared/models';

interface DialogData {
  movieId: number;
}

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class MovieDetailsDialogComponent implements OnInit, OnDestroy {
  private readonly movieApiService = inject(MovieApiService);
  private readonly dialogRef = inject(MatDialogRef<MovieDetailsDialogComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA) as DialogData;

  movieDetails = signal<MovieDetails | null>(null);
  isLoading = signal(true);
  userRating = signal(0);
  isSubmittingRating = signal(false);
  ratingSubmitted = signal(false);
  ratingError = signal<string | null>(null);

  private sessionId: string | null = null;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMovieDetails(): void {
    const movieId = this.dialogData?.movieId;
    
    if (!movieId) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.movieApiService.getMovieDetails(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.movieDetails.set(details);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do filme:', error);
          this.isLoading.set(false);
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

  setRating(stars: number): void {
    this.userRating.set(stars);
  }

  submitRating(): void {
    const movieId = this.dialogData?.movieId;
    const rating = this.userRating();

    console.log('Tentando enviar rating:', { movieId, rating });

    if (!movieId || rating <= 0 || rating > 10) {
      this.ratingError.set('Por favor, insira uma avaliação válida entre 0.5 e 10.');
      console.error('Validação falhou. Rating:', rating);
      return;
    }

    this.isSubmittingRating.set(true);
    this.ratingError.set(null);

    // Obter sessionId se não houver
    if (!this.sessionId) {
      this.movieApiService.getSessionId()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.sessionId = response.guest_session_id;
            console.log('SessionId obtido:', this.sessionId);
            this.postRating(movieId, rating);
          },
          error: (error) => {
            console.error('Erro ao obter sessão de guest:', error);
            this.ratingError.set('Erro ao obter sessão. Tente novamente.');
            this.isSubmittingRating.set(false);
          }
        });
    } else {
      console.log('Usando sessionId existente:', this.sessionId);
      this.postRating(movieId, rating);
    }
  }

  private postRating(movieId: number, rating: number): void {
    if (!this.sessionId) {
      console.error('Sem sessionId disponível');
      return;
    }

    console.log('Enviando rating para API:', { movieId, rating, sessionId: this.sessionId });

    this.movieApiService.rateMovie(movieId, rating, this.sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Resposta da API:', response);
          this.ratingSubmitted.set(true);
          this.isSubmittingRating.set(false);
          this.userRating.set(0);
          
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            this.ratingSubmitted.set(false);
          }, 3000);
        },
        error: (error) => {
          console.error('Erro ao enviar avaliação:', error);
          console.error('Status da resposta:', error?.status);
          console.error('Body da resposta:', error?.error);
          this.ratingError.set('Erro ao enviar avaliação. Tente novamente.');
          this.isSubmittingRating.set(false);
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
