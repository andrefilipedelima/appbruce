export interface Pessoa{
    popularity: number,
    known_for_department: string,
    gender: number,
    id: number,
    profile_path: string,
    adult: boolean,
    known_for: {
        poster_path: string,
        id: number,
        vote_count: number,
        video: boolean,
        media_type: string,
        adult: boolean,
        backdrop_path: string,
        genre_ids: number[],
        original_title: string,
        original_language: string,
        title: string,
        vote_average: number,
        overview: string,
        release_date: string
        }[]
    name: string
}