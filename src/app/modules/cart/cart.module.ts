import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartComponent} from './cart.component';
import {CartModuleRouting} from './cart.module.routing';
import { OrderBlockComponent } from './components/order-block/order-block.component';
import { ContragentComponent } from './components/contragent/contragent.component';
import {PipeModule} from 'app/pipes/pipe.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        CartComponent,
        OrderBlockComponent,
        ContragentComponent
    ],
    imports: [
        CommonModule,
        CartModuleRouting,
        PipeModule,
        ReactiveFormsModule,
    ]
})
export class CartModule {
}
