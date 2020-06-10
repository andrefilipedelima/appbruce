import { ParametroBusca } from './parametroBusca';

export interface HistoricoBusca{
    id: string,
    dataBusca: number,
    porTitulo: boolean,
    tituloBuscado?: string,
    detalhada?: {
        midia: 'tv' | 'movie',
        parametrosBusca: ParametroBusca[]
    }
}