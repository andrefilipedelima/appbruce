import { NgModule } from '@angular/core';
import { 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MAT_DATE_LOCALE,
    MatCheckboxModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule
} from '@angular/material';

@NgModule({
    imports:[
        MatNativeDateModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDividerModule,
        MatMenuModule,
        MatToolbarModule,
        MatSidenavModule      
    ],
    exports:[
        MatNativeDateModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDividerModule,
        MatMenuModule,
        MatToolbarModule,
        MatSidenavModule
    ],
    providers:[
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
    ]
})
export class MaterialModule {}