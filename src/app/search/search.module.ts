import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchModuleRouting} from './routing.search.module';
import {ClinicCardComponent} from './search/components/clinic.card/clinic.card.component';
import {SearchComponent} from './search/search.component';

@NgModule({
  declarations: [
      SearchComponent,
      ClinicCardComponent
  ],
  imports: [
    CommonModule,
    SearchModuleRouting
  ],
    exports: [

    ]
})
export class SearchModule { }
