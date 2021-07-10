import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchModuleRouting} from './routing.search.module';
import {ClinicCardComponent} from './search/components/clinic.card/clinic.card.component';
import {SearchComponent} from './search/search.component';
import {PaginatorComponent} from './search/components/paginator/paginator.component';

@NgModule({
  declarations: [
      SearchComponent,
      ClinicCardComponent,
      PaginatorComponent
  ],
  imports: [
    CommonModule,
    SearchModuleRouting
  ],
    exports: [

    ]
})
export class SearchModule { }
