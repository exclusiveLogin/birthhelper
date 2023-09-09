import { NgModule } from "@angular/core";
import { PaginatorComponent } from "./paginator/paginator.component";
import { CommonModule } from "@angular/common";
import { RateButtonComponent } from "./rate-button/rate-button.component";

@NgModule({
    declarations: [
        PaginatorComponent,
        RateButtonComponent,
    ],
    imports: [CommonModule],
    exports: [
        PaginatorComponent,
        RateButtonComponent,
    ],
})
export class SharedModule {}
