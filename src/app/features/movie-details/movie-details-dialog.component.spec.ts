import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { MovieDetailsDialogComponent } from './movie-details-dialog.component';
import { MovieApiService } from '../../core/services/movie-api.service';
import { MovieDetails } from '../../shared/models';

describe('MovieDetailsDialogComponent', () => {
  let component: MovieDetailsDialogComponent;
  let fixture: ComponentFixture<MovieDetailsDialogComponent>;
  let movieApiService: jasmine.SpyObj<MovieApiService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<MovieDetailsDialogComponent>>;

  const mockMovieDetails: MovieDetails = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    vote_average: 8.5,
    overview: 'Test overview',
    release_date: '2023-01-01',
    budget: 1000000,
    revenue: 5000000,
    vote_count: 100,
    spoken_languages: [
      { iso_639_1: 'en', name: 'English' },
      { iso_639_1: 'pt', name: 'Portuguese' }
    ],
    runtime: 120
  };

  const mockDialogData = { movieId: 1 };

  beforeEach(async () => {
    const movieApiServiceSpy = jasmine.createSpyObj('MovieApiService', [
      'getMovieDetails',
      'getImageUrl',
      'getSessionId',
      'rateMovie'
    ]);

    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MovieDetailsDialogComponent],
      providers: [
        { provide: MovieApiService, useValue: movieApiServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    movieApiService = TestBed.inject(MovieApiService) as jasmine.SpyObj<MovieApiService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<MovieDetailsDialogComponent>>;

    fixture = TestBed.createComponent(MovieDetailsDialogComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should load movie details on init', () => {
      movieApiService.getMovieDetails.and.returnValue(of(mockMovieDetails));

      fixture.detectChanges();

      expect(movieApiService.getMovieDetails).toHaveBeenCalledWith(1);
      expect(component.movieDetails()).toEqual(mockMovieDetails);
      expect(component.isLoading()).toBe(false);
    });

    it('should handle missing movieId', () => {
      // Create a new test bed with no movieId in data
      const testBed = TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [MovieDetailsDialogComponent],
        providers: [
          { provide: MovieApiService, useValue: movieApiService },
          { provide: MatDialogRef, useValue: dialogRef },
          { provide: MAT_DIALOG_DATA, useValue: { movieId: null } }
        ]
      });

      const testFixture = TestBed.createComponent(MovieDetailsDialogComponent);
      const testComponent = testFixture.componentInstance;

      testFixture.detectChanges();

      expect(movieApiService.getMovieDetails).not.toHaveBeenCalled();
      expect(testComponent.isLoading()).toBe(false);
    });

    it('should handle error when loading movie details', () => {
      const error = new Error('API Error');
      movieApiService.getMovieDetails.and.returnValue(throwError(() => error));

      spyOn(console, 'error');

      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getImageUrl', () => {
    beforeEach(() => {
      movieApiService.getImageUrl.and.returnValue('https://image.tmdb.org/t/p/w500/test.jpg');
    });

    it('should return image URL for valid poster path', () => {
      const url = component.getImageUrl('/test.jpg');

      expect(movieApiService.getImageUrl).toHaveBeenCalledWith('/test.jpg');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
    });

    it('should return placeholder for null poster path', () => {
      const url = component.getImageUrl(null);

      expect(url).toBe('assets/placeholder.png');
    });

    it('should return placeholder for undefined poster path', () => {
      const url = component.getImageUrl(undefined);

      expect(url).toBe('assets/placeholder.png');
    });
  });

  describe('getLanguagesText', () => {
    it('should return formatted languages text', () => {
      component.movieDetails.set(mockMovieDetails);

      const text = component.getLanguagesText();

      expect(text).toBe('English, Portuguese');
    });

    it('should return "Not available" for null languages', () => {
      const movieWithoutLanguages: MovieDetails = { ...mockMovieDetails, spoken_languages: [] };
      component.movieDetails.set(movieWithoutLanguages);

      const text = component.getLanguagesText();

      expect(text).toBe('Not available');
    });

    it('should return "Not available" when movie details is null', () => {
      component.movieDetails.set(null);

      const text = component.getLanguagesText();

      expect(text).toBe('Not available');
    });
  });

  describe('formatCurrency', () => {
    it('should format valid currency values', () => {
      const formatted = component.formatCurrency(1000000);

      expect(formatted).toContain('1.000.000');
    });

    it('should return "Not available" for undefined value', () => {
      const formatted = component.formatCurrency(undefined);

      expect(formatted).toBe('Not available');
    });

    it('should return "Not available" for 0 value', () => {
      const formatted = component.formatCurrency(0);

      expect(formatted).toBe('Not available');
    });
  });

  describe('setRating', () => {
    it('should set user rating', () => {
      component.setRating(8);

      expect(component.userRating()).toBe(8);
    });

    it('should allow rating changes', () => {
      component.setRating(5);
      expect(component.userRating()).toBe(5);

      component.setRating(9);
      expect(component.userRating()).toBe(9);
    });
  });

  describe('submitRating', () => {
    beforeEach(() => {
      movieApiService.getSessionId.and.returnValue(
        of({ guest_session_id: 'test-session-id' })
      );
      movieApiService.rateMovie.and.returnValue(of({ success: true }));
      spyOn(console, 'log');
      spyOn(console, 'error');
    });

    it('should validate rating is within range', () => {
      component.userRating.set(0);

      component.submitRating();

      expect(component.ratingError()).toBe('Please enter a valid rating between 0.5 and 10.');
    });

    it('should not submit with invalid rating > 10', () => {
      component.userRating.set(11);

      component.submitRating();

      expect(component.ratingError()).toBe('Please enter a valid rating between 0.5 and 10.');
      expect(movieApiService.getSessionId).not.toHaveBeenCalled();
    });

    it('should get session ID if not available', (done) => {
      component.userRating.set(8);

      component.submitRating();

      setTimeout(() => {
        expect(movieApiService.getSessionId).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should handle session ID retrieval error', (done) => {
      const error = new Error('Session error');
      movieApiService.getSessionId.and.returnValue(throwError(() => error));
      component.userRating.set(8);

      component.submitRating();

      setTimeout(() => {
        expect(component.ratingError()).toContain('Error obtaining session');
        expect(component.isSubmittingRating()).toBe(false);
        done();
      }, 100);
    });

    it('should submit rating with valid data', (done) => {
      component['sessionId'] = 'test-session-id';
      component.userRating.set(8);

      component.submitRating();

      setTimeout(() => {
        expect(movieApiService.rateMovie).toHaveBeenCalledWith(1, 8, 'test-session-id');
        done();
      }, 100);
    });

    it('should set ratingSubmitted flag on success', (done) => {
      component['sessionId'] = 'test-session-id';
      component.userRating.set(8);

      component.submitRating();

      setTimeout(() => {
        expect(component.ratingSubmitted()).toBe(true);
        expect(component.userRating()).toBe(0);
        expect(component.isSubmittingRating()).toBe(false);
        done();
      }, 100);
    });

    it('should hide success message after 3 seconds', (done) => {
      component['sessionId'] = 'test-session-id';
      component.userRating.set(8);

      component.submitRating();

      setTimeout(() => {
        expect(component.ratingSubmitted()).toBe(false);
        done();
      }, 3100);
    });

    it('should handle rating submission error', (done) => {
      const error = new Error('Rating error');
      movieApiService.rateMovie.and.returnValue(throwError(() => error));
      component['sessionId'] = 'test-session-id';
      component.userRating.set(8);

      component.submitRating();

      setTimeout(() => {
        expect(component.ratingError()).toContain('Error submitting rating');
        expect(component.isSubmittingRating()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component.closeDialog();

      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
