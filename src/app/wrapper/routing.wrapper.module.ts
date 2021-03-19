import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from '../NotFound/NotFound.component';
import {WrapperComponent} from './wrapper.component';



const routes: Routes = [{
  path: '',
  redirectTo: 'search',
}, {
  path: 'search',
  loadChildren: () => import('../search/search.module').then(m => m.SearchModule),
  component: WrapperComponent,
}, {
  path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const WrapperModuleRouting = RouterModule.forChild(routes);
