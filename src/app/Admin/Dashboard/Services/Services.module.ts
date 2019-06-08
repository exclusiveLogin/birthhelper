import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './Services.component';
import { TableModule } from '../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
  ],
  declarations: [ServicesComponent],
  exports: [
    ServicesComponent
  ]
})
export class ServicesModule { }
