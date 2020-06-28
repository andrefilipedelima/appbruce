import { Genero } from './genero';

export interface Preferencias{
    id: string,
    id_generos_tv:Genero[],
    id_generos_movie:Genero[]
}