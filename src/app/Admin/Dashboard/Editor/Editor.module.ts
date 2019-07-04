import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './Editor.component';
import { TableModule } from '../../table/table.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
  ],
  declarations: [EditorComponent],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
