import { ParametroBusca } from './parametroBusca';
import { ParametroBuscaLog } from './parametroBuscaLog';

export interface HistoricoBusca{
    id: string,
    dataBusca: Date,
    porTitulo: boolean,
    tituloBuscado?: string,
    detalhada?: {
        midia: 'tv' | 'movie',
        midiaMostrar: string,
        parametrosBusca: ParametroBuscaLog[]
    }
}