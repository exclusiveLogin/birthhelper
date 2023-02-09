import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import {FormsModule} from '@angular/forms';



@NgModule({
    declarations: [
        DialogComponent
    ],
    exports: [
        DialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class DialogModule { }
