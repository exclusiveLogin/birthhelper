import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../NotFound/NotFound.component';
import {CartComponent} from './cart.component';

const routes: Routes = [{
    path: '',
    component: CartComponent,
}, {
    path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const CartModuleRouting = RouterModule.forChild(routes);
