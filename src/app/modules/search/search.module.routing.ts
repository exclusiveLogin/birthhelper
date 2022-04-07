import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../NotFound/NotFound.component';
import {SearchComponent} from './search/search.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'clinics',
  pathMatch: 'full',
}, {
  path: 'clinics',
  component: SearchComponent,
    data: {
      section: 'clinic'
    }
}, {
    path: 'consultations',
    component: SearchComponent,
    data: {
        section: 'consultation'
    }
},
    {
  path: '**', component: NotFoundComponent,
}];


// tslint:disable-next-line: variable-name
export const SearchModuleRouting = RouterModule.forChild(routes);
