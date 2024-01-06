import { Pipe, PipeTransform } from "@angular/core";
import { digitalPrettier } from "app/modules/utils/digit-separator";

@Pipe({
    name: "digitalSeparator",
})
export class DigitalSeparatorPipe implements PipeTransform {
    transform(value: string | number): string {
        return digitalPrettier(value);
    }
}
