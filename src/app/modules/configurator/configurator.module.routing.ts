import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../NotFound/NotFound.component';
import {ConfiguratorComponent} from './configurator.component';

const routes: Routes = [{
    path: ':id',
    component: ConfiguratorComponent
}, {
    path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const ConfiguratorModuleRouting = RouterModule.forChild(routes);
