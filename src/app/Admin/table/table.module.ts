import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { PaginatorComponent } from './table/paginator/paginator.component';
import { CellComponent } from './table/cell/cell.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    PaginatorComponent,
    CellComponent
  ],
  exports: [
    TableComponent,
    PaginatorComponent,
    CellComponent
  ]
})
export class TableModule { }
