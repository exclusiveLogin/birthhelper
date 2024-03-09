import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
} from "@angular/core";
import { Contragent } from "@models/contragent.interface";

@Component({
    selector: "app-contragent-card",
    templateUrl: "./contragent-card.component.html",
    styleUrls: ["./contragent-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContragentCardComponent implements OnInit {
    @Input() contragent: Contragent;

    constructor() {}

    ngOnInit(): void {
        console.log("ContragentCardComponent: ", this);
    }
}
