import { Movie } from './movie.model';

export interface Collection {
  id: string;
  title: string;
  description: string;
  movies?: Movie[];
  createdAt?: Date;
}
