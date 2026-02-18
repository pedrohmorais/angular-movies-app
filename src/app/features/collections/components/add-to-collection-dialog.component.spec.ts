import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddToCollectionDialogComponent } from './add-to-collection-dialog.component';
import { CollectionsService } from '../services/collections.service';
import { Movie, Collection } from '../../../shared/models';

describe('AddToCollectionDialogComponent', () => {
  let component: AddToCollectionDialogComponent;
  let fixture: ComponentFixture<AddToCollectionDialogComponent>;
  let collectionsService: jasmine.SpyObj<CollectionsService>;
  let router: jasmine.SpyObj<Router>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddToCollectionDialogComponent>>;

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Movie 1',
      poster_path: '/movie1.jpg',
      vote_average: 8.0,
      overview: 'Overview 1',
      release_date: '2023-01-01'
    },
    {
      id: 2,
      title: 'Movie 2',
      poster_path: '/movie2.jpg',
      vote_average: 7.0,
      overview: 'Overview 2',
      release_date: '2023-02-01'
    }
  ];

  const mockCollections: Collection[] = [
    {
      id: '1',
      title: 'Favorites',
      description: 'My favorite movies',
      movies: [],
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'To Watch',
      description: 'Movies to watch',
      movies: [],
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    const collectionsServiceSpy = jasmine.createSpyObj('CollectionsService', [
      'getAll',
      'addMovieToCollection'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AddToCollectionDialogComponent],
      providers: [
        { provide: CollectionsService, useValue: collectionsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { movies: mockMovies } }
      ]
    }).compileComponents();

    collectionsService = TestBed.inject(CollectionsService) as jasmine.SpyObj<CollectionsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddToCollectionDialogComponent>>;

    fixture = TestBed.createComponent(AddToCollectionDialogComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should load collections on init', () => {
      collectionsService.getAll.and.returnValue(mockCollections);

      fixture.detectChanges();

      expect(collectionsService.getAll).toHaveBeenCalled();
      expect(component.collections).toEqual(mockCollections);
    });

    it('should handle empty collections', () => {
      collectionsService.getAll.and.returnValue([]);

      fixture.detectChanges();

      expect(component.collections).toEqual([]);
    });
  });

  describe('toggleCollection', () => {
    beforeEach(() => {
      component.collections = mockCollections;
    });

    it('should add collection to selection when not selected', () => {
      component.toggleCollection('1');

      expect(component.isCollectionSelected('1')).toBe(true);
    });

    it('should remove collection from selection when already selected', () => {
      component.selectedCollectionIds.add('1');

      component.toggleCollection('1');

      expect(component.isCollectionSelected('1')).toBe(false);
    });

    it('should handle multiple collections', () => {
      component.toggleCollection('1');
      component.toggleCollection('2');

      expect(component.isCollectionSelected('1')).toBe(true);
      expect(component.isCollectionSelected('2')).toBe(true);
    });

    it('should toggle collection selection correctly', () => {
      component.toggleCollection('1');
      expect(component.isCollectionSelected('1')).toBe(true);

      component.toggleCollection('1');
      expect(component.isCollectionSelected('1')).toBe(false);

      component.toggleCollection('1');
      expect(component.isCollectionSelected('1')).toBe(true);
    });
  });

  describe('isCollectionSelected', () => {
    it('should return true for selected collection', () => {
      component.selectedCollectionIds.add('1');

      expect(component.isCollectionSelected('1')).toBe(true);
    });

    it('should return false for unselected collection', () => {
      expect(component.isCollectionSelected('1')).toBe(false);
    });

    it('should return false after deselection', () => {
      component.selectedCollectionIds.add('1');
      component.selectedCollectionIds.delete('1');

      expect(component.isCollectionSelected('1')).toBe(false);
    });
  });

  describe('addToSelectedCollections', () => {
    beforeEach(() => {
      collectionsService.getAll.and.returnValue(mockCollections);
      collectionsService.addMovieToCollection.and.returnValue(undefined);
    });

    it('should add all movies to selected collections', () => {
      component.data.movies = mockMovies;
      component.selectedCollectionIds.add('1');
      component.selectedCollectionIds.add('2');

      component.addToSelectedCollections();

      expect(collectionsService.addMovieToCollection).toHaveBeenCalledTimes(4); // 2 movies x 2 collections
    });

    it('should add movies with correct collection and movie data', () => {
      component.data.movies = [mockMovies[0]];
      component.selectedCollectionIds.add('1');

      component.addToSelectedCollections();

      expect(collectionsService.addMovieToCollection).toHaveBeenCalledWith('1', mockMovies[0]);
    });

    it('should close dialog after adding movies', () => {
      component.data.movies = mockMovies;
      component.selectedCollectionIds.add('1');

      component.addToSelectedCollections();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should handle no selected collections', () => {
      component.data.movies = mockMovies;
      component.selectedCollectionIds.clear();

      component.addToSelectedCollections();

      expect(collectionsService.addMovieToCollection).not.toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should handle multiple movies and collections correctly', () => {
      const movies = [mockMovies[0], mockMovies[1]];
      component.data.movies = movies;
      component.selectedCollectionIds.add('1');
      component.selectedCollectionIds.add('2');

      component.addToSelectedCollections();

      // Should be called for each combination of movie and collection
      expect(collectionsService.addMovieToCollection).toHaveBeenCalledWith('1', mockMovies[0]);
      expect(collectionsService.addMovieToCollection).toHaveBeenCalledWith('1', mockMovies[1]);
      expect(collectionsService.addMovieToCollection).toHaveBeenCalledWith('2', mockMovies[0]);
      expect(collectionsService.addMovieToCollection).toHaveBeenCalledWith('2', mockMovies[1]);
    });
  });

  describe('createNewCollection', () => {
    it('should close dialog and navigate to create page', () => {
      component.createNewCollection();

      expect(dialogRef.close).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/collections/create']);
    });

    it('should navigate to the correct route', () => {
      component.createNewCollection();

      expect(router.navigate).toHaveBeenCalledWith(['/collections/create']);
    });
  });

  describe('Component initialization', () => {
    it('should initialize with empty selected collections', () => {
      expect(component.selectedCollectionIds.size).toBe(0);
    });

    it('should receive movies data from dialog', () => {
      collectionsService.getAll.and.returnValue(mockCollections);
      fixture.detectChanges();

      expect(component.data.movies).toEqual(mockMovies);
    });

    it('should initialize collections array', () => {
      collectionsService.getAll.and.returnValue(mockCollections);
      fixture.detectChanges();

      expect(component.collections).toBeDefined();
      expect(Array.isArray(component.collections)).toBe(true);
    });
  });
});
