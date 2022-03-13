const API_KEY = "ce5d5fbe4a2df5d776a7c9913cad5b76";
const BASE_PATH = "https://api.themoviedb.org/3";
const IMAGE_PATH = "https://image.tmdb.org/t/p";

interface Dates {
  maximum: string;
  minimum: string;
}

interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IfetchMovies {
  dates: Dates;
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function fetchMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function fetchImage(id: string, fileType?: string) {
  return `${IMAGE_PATH}/${fileType ? fileType : "original"}/${id}`;
}
