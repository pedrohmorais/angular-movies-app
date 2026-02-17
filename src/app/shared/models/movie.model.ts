export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
}

export interface MovieDetails extends Movie {
  budget: number;
  revenue: number;
  vote_count: number;
  spoken_languages: SpokenLanguage[];
  release_date: string;
  runtime: number;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}
