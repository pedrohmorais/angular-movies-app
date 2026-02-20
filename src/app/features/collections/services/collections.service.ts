import { Injectable } from '@angular/core';
import type { Collection, Movie } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  private readonly STORAGE_KEY = 'movie_collections';

  constructor() {}

  getAll(): Collection[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getById(id: string): Collection | null {
    const collections = this.getAll();
    return collections.find(c => c.id === id) || null;
  }

  create(title: string, description: string): Collection {
    const collections = this.getAll();
    const newCollection: Collection = {
      id: Date.now().toString(),
      title,
      description,
      movies: [],
      createdAt: new Date()
    };

    collections.push(newCollection);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
    return newCollection;
  }

  addMovieToCollection(collectionId: string, movie: Movie): void {
    const collections = this.getAll();
    const collection = collections.find(c => c.id === collectionId);

    if (collection) {
      // Avoid duplicates
      const movieExists = collection.movies?.some((m: Movie) => m.id === movie.id);
      if (!movieExists) {
        if (!collection.movies) {
          collection.movies = [];
        }
        collection.movies.push(movie);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
      }
    }
  }

  removeMovieFromCollection(collectionId: string, movieId: number): void {
    const collections = this.getAll();
    const collection = collections.find(c => c.id === collectionId);

    if (collection && collection.movies) {
      collection.movies = collection.movies.filter((m: Movie) => m.id !== movieId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
    }
  }

  delete(id: string): void {
    const collections = this.getAll();
    const filtered = collections.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  update(id: string, title: string, description: string): void {
    const collections = this.getAll();
    const collection = collections.find(c => c.id === id);

    if (collection) {
      collection.title = title;
      collection.description = description;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
    }
  }
}
