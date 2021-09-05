import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfiguratorComponent} from './configurator.component';
import {ConfiguratorModuleRouting} from './configurator.module.routing';


@NgModule({
    declarations: [
        ConfiguratorComponent
    ],
    imports: [
        ConfiguratorModuleRouting,
        CommonModule
    ]
})
export class ConfiguratorModule {
}
