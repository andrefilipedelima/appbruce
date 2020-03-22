import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {

  public tituloPesquisa: any;
  public msgError: string;
  public goalList: any[];
  public loadedGoalList: any[];

  constructor(private tmdbService: TmdbService) { }

  ngOnInit() {
  }

  coletaTitulo(searchbar) {
    this.tituloPesquisa = searchbar.target.value;

    console.log(this.tituloPesquisa);
  }

  pesquisarPorTitulo() {
    if (this.tituloPesquisa) {
      this.msgError = "Esses foram os resultados encontrados para " + this.tituloPesquisa;

       // const teste = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise()).Producoes
       const teste = this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise();

       console.log('teste', teste);


    } else {
      this.msgError = "Não foi possivel encontrar sua busca. Tente novamente usando outros termos!";
    }
  }



  // realizarPesquisa(this.tituloPesquisa) {

  // }

}
