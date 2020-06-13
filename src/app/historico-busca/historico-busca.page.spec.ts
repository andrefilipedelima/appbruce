import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoricoBuscaPage } from './historico-busca.page';

describe('HistoricoBuscaPage', () => {
  let component: HistoricoBuscaPage;
  let fixture: ComponentFixture<HistoricoBuscaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoBuscaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoBuscaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
