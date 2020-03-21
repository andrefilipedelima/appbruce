import { Producao } from './producao';
export interface WelcomeType {
    tipo: 'emAlta' | 'popular' | 'genero';
    titulo: string;
    producoes: Producao[];
}
