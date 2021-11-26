import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthAdminGuard} from './auth.admin.guard';
import {AuthService} from '../../modules/auth-module/auth.service';
import {AdminComponent} from '../Admin.component';
import {NonAuthComponent} from '../../modules/auth-module/auth/non-auth/non-auth.component';
import {AuthComponent} from '../../modules/auth-module/auth/auth.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [AuthAdminGuard], component: AdminComponent },

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: [ RouterModule ],
  providers: []
})
export class AdminRoutingModule { }
