import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../../NotFound/NotFound.component';
import {ConfiguratorComponent} from './configurator.component';
import {ConfiguratorGuard} from './configurator.guard';

const routes: Routes = [
    {
        path: 'clinic',
        data: {
            section: 'clinic',
            entity_key: 'ent_clinic_contragents'
        },
        children: [
            {path: '', redirectTo: '/system/search/clinics', pathMatch: 'full'},
            {path: ':id', component: ConfiguratorComponent, canActivate: [ConfiguratorGuard]},
        ],
    }, {
        path: 'consultation',
        data: {
            section: 'consultation',
            entity_key: 'ent_consultation_contragents'
        },
        children: [
            {path: '', redirectTo: '/system/search/consultations', pathMatch: 'full'},
            {path: ':id', component: ConfiguratorComponent, canActivate: [ConfiguratorGuard]},
        ],
    }, {
        path: '**', component: NotFoundComponent,
    }];


// tslint:disable-next-line: variable-name
export const ConfiguratorModuleRouting = RouterModule.forChild(routes);
