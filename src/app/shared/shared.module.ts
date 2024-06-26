import { NgModule } from "@angular/core";
import { PaginatorComponent } from "./paginator/paginator.component";
import { CommonModule } from "@angular/common";
import { RateButtonComponent } from "./rate-button/rate-button.component";
import { ToggleContainerComponent } from "./toggle-container/toggle-container.component";
import { LKCommonComponentModule } from "@modules/admin/lk/common/lk.common.module";

@NgModule({
    declarations: [
        PaginatorComponent,
        RateButtonComponent,
        ToggleContainerComponent,
    ],
    imports: [CommonModule, LKCommonComponentModule],
    exports: [
        PaginatorComponent,
        RateButtonComponent,
        ToggleContainerComponent,
    ],
})
export class SharedModule {}
