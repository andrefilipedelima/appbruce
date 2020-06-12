import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {

  constructor() { }

  public form = [
    { val: 'Ação', isChecked: false },
    { val: 'Aventura', isChecked: false },
    { val: 'Animação', isChecked: false },
    { val: 'Cinema TV', isChecked: false },
    { val: 'Comédia', isChecked: false },
    { val: 'Crime', isChecked: false },
    { val: 'Drama', isChecked: false },
    { val: 'Documentário', isChecked: false },
    { val: 'Família', isChecked: false },
    { val: 'Fantasia', isChecked: false },
    { val: 'Faroeste', isChecked: false },
    { val: 'Ficção Científica', isChecked: false },
    { val: 'Guerra', isChecked: false },
    { val: 'História', isChecked: false },
    { val: 'Mistério', isChecked: false },
    { val: 'Musical', isChecked: false },
    { val: 'Romance', isChecked: false },
    { val: 'Suspense', isChecked: false },
    { val: 'Terror', isChecked: false },
  ];

  ngOnInit() {
  }

}
