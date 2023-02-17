import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartComponent } from "./cart.component";
import { CartModuleRouting } from "./cart.module.routing";
import { OrderBlockComponent } from "./components/order-block/order-block.component";
import { ContragentComponent } from "./components/contragent/contragent.component";
import { PipeModule } from "app/pipes/pipe.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ArchiveOrderGroupComponent } from "./components/archive-order-group/archive-order-group.component";
import { CartDmsComponent } from "./components/cart-dms/cart-dms.component";

@NgModule({
    declarations: [
        CartComponent,
        OrderBlockComponent,
        ContragentComponent,
        ArchiveOrderGroupComponent,
        CartDmsComponent,
    ],
    exports: [ContragentComponent],
    imports: [CommonModule, CartModuleRouting, PipeModule, ReactiveFormsModule],
})
export class CartModule {}
