export interface ParametroBusca{
    parametro: 'with_genres' | 'primary_release_year'/*para filme*/ | 'first_air_date_year'/*para serie*/ | 'with_people'/*para filmes*/ | 'with_companies' | 'with_original_language',
    valor: string
}