import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchModuleRouting} from './routing.search.module';
import {ClinicCardComponent} from './search/components/clinic.card/clinic.card.component';
import {SearchComponent} from './search/search.component';
import {PaginatorComponent} from './search/components/paginator/paginator.component';
import {FilterComponent} from './search/components/filter/filter.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
      SearchComponent,
      ClinicCardComponent,
      PaginatorComponent,
      FilterComponent,
  ],
    imports: [
        CommonModule,
        SearchModuleRouting,
        FormsModule
    ],
    exports: [

    ]
})
export class SearchModule { }
