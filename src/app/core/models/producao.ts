export interface Producao{
    poster_path: string;
    overview: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    backdrop_path: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
    media_type: string;

    adult: boolean;
    release_date: string;
    original_title: string;
    title: string;
    video: boolean;

    first_air_date: string;
    origin_country: string[];
    name: string;
    original_name: string;
}