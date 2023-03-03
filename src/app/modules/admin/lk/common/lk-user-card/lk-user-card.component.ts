import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { User } from "@models/user.interface";
import { RestService } from "@services/rest.service";
import { Observable, of } from "rxjs";
import { IImage } from "@modules/admin/Dashboard/Editor/components/image/image.component";
import { filter, map, switchMap, tap } from "rxjs/operators";

@Component({
    selector: "app-lk-user-card",
    templateUrl: "./lk-user-card.component.html",
    styleUrls: ["./lk-user-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkUserCardComponent implements OnInit {
    @Input() user: User;
    userPhotoImage$: Observable<IImage>;
    constructor(private restService: RestService) {}

    ngOnInit(): void {
        this.userPhotoImage$ = of(this.user).pipe(
            filter((user) => !!user?.photo_id),
            map((user) => user.photo_id),
            switchMap((photoId) =>
                this.restService.getEntity<IImage>("ent_images", photoId)
            ),
            tap((image) => console.log("userPhotoImage$", image))
        );
    }
}
