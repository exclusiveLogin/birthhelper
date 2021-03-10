import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthService} from '../auth-module/auth.service';
import {AdminComponent} from '../Admin.component';
import {NonAuthComponent} from '../auth-module/auth/non-auth/non-auth.component';
import {AuthComponent} from '../auth-module/auth/auth.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [AuthGuard], component: AdminComponent },
  { path: 'auth', pathMatch: 'full', component: AuthComponent },
  { path: 'non', pathMatch: 'full', component: NonAuthComponent }
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
