import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MovieApiService } from '../../core/services/movie-api.service';
import { SearchValidatorDirective } from '../../shared/directives/search-validator.directive';
import { Movie } from '../../shared/models';
import { MovieDetailsDialogComponent } from '../movie-details/movie-details-dialog.component';
import { AddToCollectionDialogComponent } from '../collections/components/add-to-collection-dialog.component';
import { MATERIAL_MODULES } from '../../shared/material/material.module';

@Component({
  selector: 'app-search-page',
  standalone: true,
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss',
  imports: [
    ...MATERIAL_MODULES,
    ReactiveFormsModule,
    SearchValidatorDirective,
    DatePipe
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

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private movieApiService: MovieApiService,
    private dialog: MatDialog,
    private router: Router
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
          console.error('Error searching for movies:', error);
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
            console.error('Error searching for movies:', error);
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

  openMovieDetails(movieId: number): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { movieId }
    });
  }

  getImageUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/placeholder.png';
    }
    return this.movieApiService.getImageUrl(posterPath);
  }

  createNewCollection(): void {
    this.router.navigate(['/collections/create']);
  }
}
