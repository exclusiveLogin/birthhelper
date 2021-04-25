import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters/filters.component';



@NgModule({
  declarations: [
    FiltersComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltersComponent
  ]
})
export class FiltersModule { }
