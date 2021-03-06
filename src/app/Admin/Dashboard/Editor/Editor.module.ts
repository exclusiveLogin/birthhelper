import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './Editor.component';
import { TableModule } from '../../table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { ImageComponent } from './components/image/image.component';
import {ToastrService} from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
  ],
  declarations: [
    EditorComponent,
    AutocompleteComponent,
    ImageComponent
  ],
  exports: [
    EditorComponent
  ],
  providers: [
    ToastrService,
  ]
})
export class EditorModule { }
