import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from '../NotFound/NotFound.component';
import {WrapperComponent} from './wrapper.component';



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
    component: WrapperComponent,
}, {
  path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const WrapperModuleRouting = RouterModule.forChild(routes);