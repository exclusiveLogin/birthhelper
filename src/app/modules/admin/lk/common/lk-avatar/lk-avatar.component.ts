import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { ImageService } from "@services/image.service";
import { IImage } from "@modules/admin/Dashboard/Editor/components/image/image.component";
import { BehaviorSubject, Observable } from "rxjs";
import { SafeUrl } from "@angular/platform-browser";
import { randomColor } from "@modules/utils/random";

@Component({
    selector: "app-lk-avatar",
    templateUrl: "./lk-avatar.component.html",
    styleUrls: ["./lk-avatar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkAvatarComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() image: IImage;
    @Input() size: number = 64;
    defaultColorAvatar: string = randomColor(50, 100);

    photoUrl$: Observable<SafeUrl>;
    imageSignal$: BehaviorSubject<null>;

    constructor(private imageService: ImageService) {}

    get avatarTitle(): string {
        const result: string[] = [];
        result.push(this?.title[0]);
        result.push(this?.subtitle?.[0]);
        result.push(this?.title[1]);
        return result
            .filter((_) => !!_)
            .slice(0, 2)
            .map((_) => _.toUpperCase())
            .join("");
    }

    ngOnInit(): void {
        if (this.image) {
            [this.photoUrl$, this.imageSignal$] = this.imageService.getImage$(
                this.image
            );
        }
    }
}
