import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchModuleRouting} from './search.module.routing';
import {ClinicCardComponent} from './search/components/clinic.card/clinic.card.component';
import {SearchComponent} from './search/search.component';
import {PaginatorComponent} from './search/components/paginator/paginator.component';
import {FilterComponent} from './search/components/filter/filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConsultationCardComponent} from '@modules/search/search/components/consultation.card/consultation.card.component';

@NgModule({
  declarations: [
      SearchComponent,
      ClinicCardComponent,
      ConsultationCardComponent,
      PaginatorComponent,
      FilterComponent,
  ],
    imports: [
        CommonModule,
        SearchModuleRouting,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [

    ]
})
export class SearchModule { }
