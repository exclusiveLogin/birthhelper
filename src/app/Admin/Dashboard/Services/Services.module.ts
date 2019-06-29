import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './Services.component';
import { TableModule } from '../../table/table.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
  ],
  declarations: [ServicesComponent],
  exports: [
    ServicesComponent
  ]
})
export class ServicesModule { }
