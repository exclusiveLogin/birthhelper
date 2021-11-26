import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartComponent} from './cart.component';
import {CartModuleRouting} from './cart.module.routing';


@NgModule({
    declarations: [
        CartComponent
    ],
    imports: [
        CommonModule,
        CartModuleRouting
    ]
})
export class CartModule {
}
