import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieDetails } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private readonly API_BASE_URL = 'https://api.themoviedb.org/3';
  private readonly API_KEY = '85204a8cc33baf447559fb6d51b18313';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<any>(`${this.API_BASE_URL}/search/movie`, { params });
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('append_to_response', 'videos');

    return this.http.get<MovieDetails>(`${this.API_BASE_URL}/movie/${movieId}`, { params });
  }

  getSessionId(): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY);

    return this.http.get<any>(`${this.API_BASE_URL}/authentication/guest_session/new`, { params });
  }

  rateMovie(movieId: number, rating: number, sessionId: string): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('guest_session_id', sessionId);

    const payload = { value: rating };
    
    console.log('rateMovie - payload:', { movieId, sessionId, payload });

    return this.http.post<any>(
      `${this.API_BASE_URL}/movie/${movieId}/rating`,
      payload,
      { params }
    );
  }

  getImageUrl(posterPath: string): string {
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }
}
