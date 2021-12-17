import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileModuleRouting} from 'app/modules/profile/profile.module,routing';


@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ProfileModuleRouting
    ]
})
export class ProfileModule {
}
