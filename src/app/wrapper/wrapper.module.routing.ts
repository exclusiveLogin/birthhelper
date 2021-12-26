import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from '../NotFound/NotFound.component';
import {WrapperComponent} from './wrapper.component';
import {AuthAdminGuard} from '../guards/auth.admin.guard';
import {AuthUserGuard} from '../guards/user.guard';



const routes: Routes = [{
  path: '',
  redirectTo: 'search',
  pathMatch: 'full',
}, {
  path: 'search',
  loadChildren: () => import('../modules/search/search.module').then(m => m.SearchModule),
  component: WrapperComponent,
}, {
    path: 'configurator',
    loadChildren: () => import('../modules/configurator/configurator.module').then(m => m.ConfiguratorModule),
    component: WrapperComponent,
}, {
    path: 'cart',
    loadChildren: () => import('../modules/cart/cart.module').then(m => m.CartModule),
    component: WrapperComponent,
}, {
    path: 'profile',
    loadChildren: () => import('../modules/profile/profile.module').then(m => m.ProfileModule),
    canLoad: [AuthUserGuard],
    component: WrapperComponent,
}, {
  path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const WrapperModuleRouting = RouterModule.forChild(routes);
