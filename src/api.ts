const API_KEY = "ce5d5fbe4a2df5d776a7c9913cad5b76";
const BASE_PATH = "https://api.themoviedb.org/3";
const IMAGE_PATH = "https://image.tmdb.org/t/p";
export interface Dates {
  maximum: string;
  minimum: string;
}

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_titlße: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IFetchMovies {
  dates: Dates;
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
// ########################################################################################################################

export interface KnownFor {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  name: string;
  origin_country: string[];
  original_name: string;
}

export interface ISearchResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
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
  first_air_date: string;
  name: string;
  origin_country: string[];
  original_name: string;
  gender?: number;
  known_for: KnownFor[];
  known_for_department: string;
  profile_path?: any;
}

export interface IFetchSearch {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export type IContents = IMovie & ITV;

// ########################################################################################################################

export interface ITV {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface IFetchTV {
  page: number;
  results: ITV[];
  total_pages: number;
  total_results: number;
}

// ########################################################################################################################

export function fetchMovies(option: string) {
  return fetch(`${BASE_PATH}/movie/${option}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function fetchTV(option: string) {
  return fetch(`${BASE_PATH}/tv/${option}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function fetchImage(id: string, fileType?: string) {
  return `${IMAGE_PATH}/${fileType ? fileType : "original"}/${id}`;
}

export async function fetchSearchResult(keyword: string) {
  const data = await fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&page=1&include_adult=true`
  );
  const json = await data.json();

  return json;
}
