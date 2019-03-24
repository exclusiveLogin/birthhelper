import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './Admin.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: AdminComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
