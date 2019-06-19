import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { PaginatorComponent } from './table/paginator/paginator.component';
import { CellComponent } from './table/cell/cell.component';
import { FiltersComponent } from './table/filters/filters.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    PaginatorComponent,
    CellComponent,
    FiltersComponent
  ],
  exports: [
    TableComponent,
    PaginatorComponent,
    CellComponent
  ]
})
export class TableModule { }
