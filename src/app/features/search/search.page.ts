import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MovieApiService } from '../../core/services/movie-api.service';
import { SearchValidatorDirective } from '../../shared/directives/search-validator.directive';
import { Movie } from '../../shared/models';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { AddToCollectionDialogComponent } from '../collections/components/add-to-collection-dialog.component';
import { APP_ROUTES } from '../../app.routes.constants';

@Component({
  selector: 'app-search-page',
  standalone: true,
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    SearchValidatorDirective
  ]
})
export class SearchPage implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  movies: Movie[] = [];
  isLoading = false;
  selectedMovies: Set<number> = new Set();
  currentPage = 1;
  pageSize = 10;
  totalResults = 0;
  hasSearched = false;
  readonly APP_ROUTES = APP_ROUTES;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private movieApiService: MovieApiService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, Validators.minLength(3)]],
      appSearchValidator: ['']
    });
  }

  private setupSearchDebounce(): void {
    this.searchSubject$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.length >= 3) {
          this.performSearch(query);
        }
      });
  }

  onSearchChange(query: string): void {
    this.searchSubject$.next(query);
  }

  private performSearch(query: string): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.selectedMovies.clear();

    this.movieApiService.searchMovies(query, this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.movies = response.results || [];
          this.totalResults = response.total_results || 0;
          this.hasSearched = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao buscar filmes:', error);
          this.isLoading = false;
          this.movies = [];
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    const searchQuery = this.searchForm.get('searchQuery')?.value;
    if (searchQuery) {
      this.isLoading = true;
      this.selectedMovies.clear();

      this.movieApiService.searchMovies(searchQuery, this.currentPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.movies = response.results || [];
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao buscar filmes:', error);
            this.isLoading = false;
          }
        });
    }
  }

  toggleMovieSelection(movieId: number): void {
    if (this.selectedMovies.has(movieId)) {
      this.selectedMovies.delete(movieId);
    } else {
      this.selectedMovies.add(movieId);
    }
  }

  isMovieSelected(movieId: number): boolean {
    return this.selectedMovies.has(movieId);
  }

  addSelectedToCollection(): void {
    if (this.selectedMovies.size === 0) {
      return;
    }

    const selectedMovies = this.movies.filter(m => this.selectedMovies.has(m.id));
    this.dialog.open(AddToCollectionDialogComponent, {
      width: '500px',
      data: { movies: selectedMovies }
    });

    this.selectedMovies.clear();
  }

  getImageUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/placeholder.png';
    }
    return this.movieApiService.getImageUrl(posterPath);
  }
}
