import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfiguratorComponent} from './configurator.component';
import {ConfiguratorModuleRouting} from './configurator.module.routing';
import { ClinicHeaderComponent } from './components/clinic-header/clinic-header.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ConfiguratorCardComponent } from './components/configurator-card/configurator-card.component';
import {PipeModule} from 'app/pipes/pipe.module';


@NgModule({
    declarations: [
        ConfiguratorComponent,
        ClinicHeaderComponent,
        TabsComponent,
        ConfiguratorCardComponent
    ],
    imports: [
        ConfiguratorModuleRouting,
        CommonModule,
        PipeModule,
    ]
})
export class ConfiguratorModule {
}
