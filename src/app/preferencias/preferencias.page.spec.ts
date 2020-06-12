import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreferenciasPage } from './preferencias.page';

describe('PreferenciasPage', () => {
  let component: PreferenciasPage;
  let fixture: ComponentFixture<PreferenciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
