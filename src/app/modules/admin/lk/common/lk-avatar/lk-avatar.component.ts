import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
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
export class LkAvatarComponent {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() set image(value: IImage) {
        this.imageSetter(value);
        this._image = value;
    }
    @Input() size: number = 64;
    _image: IImage;
    defaultColorAvatar: string = randomColor(50, 100);

    photoUrl$: Observable<SafeUrl>;
    imageSignal$: BehaviorSubject<null>;

    constructor(private imageService: ImageService) {}

    get avatarTitle(): string {
        const result: string[] = [];
        result.push(this?.title?.[0]);
        result.push(this?.subtitle?.[0]);
        result.push(this?.title?.[1]);
        return result
            .filter((_) => !!_)
            .slice(0, 2)
            .map((_) => _.toUpperCase())
            .join("");
    }

    imageSetter(image: IImage) {
        if (image) {
            [this.photoUrl$, this.imageSignal$] =
                this.imageService.getImage$(image);
        }
    }
}
