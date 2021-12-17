import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../NotFound/NotFound.component';
import {ProfileComponent} from 'app/modules/profile/profile.component';

const routes: Routes = [{
    path: '',
    component: ProfileComponent,
}, {
    path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const ProfileModuleRouting = RouterModule.forChild(routes);
