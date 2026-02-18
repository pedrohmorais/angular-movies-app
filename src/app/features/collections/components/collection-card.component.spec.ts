import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CollectionCardComponent } from './collection-card.component';
import { MovieDetailsDialogComponent } from '../../movie-details/movie-details-dialog.component';
import { Movie } from '../../../shared/models';

describe('CollectionCardComponent', () => {
  let component: CollectionCardComponent;
  let fixture: ComponentFixture<CollectionCardComponent>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    vote_average: 8.5,
    overview: 'Test overview',
    release_date: '2023-01-01'
  };

  beforeEach(async () => {
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CollectionCardComponent],
      providers: [{ provide: MatDialog, useValue: matDialogSpy }]
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture = TestBed.createComponent(CollectionCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept movie input', () => {
    component.movie = mockMovie;
    fixture.detectChanges();

    expect(component.movie).toEqual(mockMovie);
  });

  it('should display movie title and image', () => {
    component.movie = mockMovie;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    const title = compiled.querySelector('h3');

    expect(img?.getAttribute('src')).toBe(mockMovie.poster_path);
    expect(img?.getAttribute('alt')).toContain(mockMovie.title);
    expect(title?.textContent).toContain(mockMovie.title);
  });

  it('should open movie details dialog on click', () => {
    component.movie = mockMovie;
    matDialog.open.and.returnValue({
      afterClosed: () => ({
        subscribe: () => {}
      })
    } as any);

    component.goToDetails();

    expect(matDialog.open).toHaveBeenCalledWith(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { movieId: mockMovie.id }
    });
  });

  it('should open dialog with correct movie ID', () => {
    const anotherMovie: Movie = {
      ...mockMovie,
      id: 42,
      title: 'Another Movie'
    };
    component.movie = anotherMovie;
    matDialog.open.and.returnValue({
      afterClosed: () => ({
        subscribe: () => {}
      })
    } as any);

    component.goToDetails();

    expect(matDialog.open).toHaveBeenCalledWith(
      MovieDetailsDialogComponent,
      jasmine.objectContaining({
        data: { movieId: 42 }
      })
    );
  });

  it('should have clickable card element', () => {
    component.movie = mockMovie;
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.movie-card');
    expect(card).toBeTruthy();
    expect(card.classList.contains('movie-card')).toBe(true);
  });

  it('should have proper styling classes', () => {
    component.movie = mockMovie;
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.movie-card');
    const styles = window.getComputedStyle(card);

    // Verify cursor is pointer (clickable)
    expect(styles.cursor).toBe('pointer');
  });
});
