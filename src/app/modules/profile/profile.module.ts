import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileModuleRouting} from 'app/modules/profile/profile.module,routing';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ProfileModuleRouting,
        ReactiveFormsModule
    ]
})
export class ProfileModule {
}
