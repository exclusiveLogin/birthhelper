import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DigitalSeparatorPipe } from "app/pipes/digital-separator.pipe";

@NgModule({
    declarations: [DigitalSeparatorPipe],
    imports: [CommonModule],
    exports: [DigitalSeparatorPipe],
})
export class PipeModule {}
