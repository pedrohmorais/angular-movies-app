import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieDetails } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private readonly apiBaseUrl = environment.api.baseUrl;
  private readonly apiKey = environment.api.apiKey;
  private readonly imageBaseUrl = environment.api.imageBaseUrl;

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<any>(`${this.apiBaseUrl}/search/movie`, { params });
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('append_to_response', 'videos');

    return this.http.get<MovieDetails>(`${this.apiBaseUrl}/movie/${movieId}`, { params });
  }

  getSessionId(): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey);

    return this.http.get<any>(`${this.apiBaseUrl}/authentication/guest_session/new`, { params });
  }

  rateMovie(movieId: number, rating: number, sessionId: string): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('guest_session_id', sessionId);

    const payload = { value: rating };

    return this.http.post<any>(
      `${this.apiBaseUrl}/movie/${movieId}/rating`,
      payload,
      { params }
    );
  }

  getImageUrl(posterPath: string): string {
    return `${this.imageBaseUrl}${posterPath}`;
  }
}
