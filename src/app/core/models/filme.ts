import { Genero } from './genero';

export interface Filme{
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection: {},
    budget: number,
    genres: Genero[],
    homepage: string,
    id: number,
    imdb_id: string,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: {
        name: string,
        id: number,
        logo_path: string,
        origin_country: string,
    }[],
    production_countries: {
        iso_3166_1: string,
        name: string
    }[],
    release_date: string,
    revenue: number,
    runtime: number,
    spoken_languages: {
        iso_639_1: string,
        name: string
    }[],
    status: string,
    tagline: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
}