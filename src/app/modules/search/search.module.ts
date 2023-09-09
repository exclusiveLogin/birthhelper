import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchModuleRouting } from "./search.module.routing";
import { ClinicCardComponent } from "./search/components/clinic.card/clinic.card.component";
import { SearchComponent } from "./search/search.component";
import { FilterComponent } from "./search/components/filter/filter.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConsultationCardComponent } from "@modules/search/search/components/consultation.card/consultation.card.component";
import { SharedModule } from "@shared/shared.module";

@NgModule({
    declarations: [
        SearchComponent,
        ClinicCardComponent,
        ConsultationCardComponent,
        FilterComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        SearchModuleRouting,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [],
})
export class SearchModule {}
