import { ParametroBusca } from './parametroBusca';

export interface HistoricoBusca{
    id: string,
    dataBusca: Date,
    porTitulo: boolean,
    tituloBuscado?: string,
    detalhada?: {
        midia: 'tv' | 'movie',
        parametrosBusca: ParametroBusca[]
    }
}