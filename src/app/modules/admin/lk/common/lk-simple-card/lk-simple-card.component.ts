import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { Observable, of } from "rxjs";
import { IImage } from "@modules/admin/Dashboard/Editor/components/image/image.component";
import { filter, switchMap, tap } from "rxjs/operators";
import { RestService } from "@services/rest.service";
import { SummaryRateByTargetResponse } from "@modules/feedback/models";

@Component({
    selector: "app-lk-simple-card",
    templateUrl: "./lk-simple-card.component.html",
    styleUrls: ["./lk-simple-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkSimpleCardComponent implements OnInit {
    @Input() photoId: number;
    @Input() title: string;
    @Input() subTitle: string;
    @Input() accentTitle: string;
    @Input() rating: SummaryRateByTargetResponse;
    constructor(private restService: RestService) {}
    photoImage$: Observable<IImage>;

    ngOnInit(): void {
        this.photoImage$ = of(this.photoId).pipe(
            filter((photoId) => !!photoId),
            switchMap((photoId) =>
                this.restService.getEntity<IImage>("ent_images", photoId)
            ),
            // tap((image) => console.log("photoImage$", image))
        );
    }

    rateLevelClass(stat: number): string {
        if (stat < 2) return "red";
        if (stat >= 2 && stat <= 3.5) return "orange";
        if (stat > 3.5) return "green";
        return "";
    }
}
