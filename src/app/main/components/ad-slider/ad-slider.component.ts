import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface SliderSettings {
    id: string;
    imageFileName: string;
    backgroundColor: string;
    backgroundColorOpacity?: string;
    backgroundPicture?: string;
    price?: string;
    priceColor?: string;
    title?: string;
    titleColor?: string;
    accentTitle?: string;
    accentTitleColor?: string;
    description?: string;
    descriptionColor?: string;
    link?: string[];
}

interface Style {
    [key: string]: string;
}

@Component({
    selector: "app-ad-slider",
    templateUrl: "./ad-slider.component.html",
    styleUrls: ["./ad-slider.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdSliderComponent implements OnInit, OnDestroy {
    wrapperStyle: Style = {};
    pictureStyle: Style = {};
    titleStyle: Style = {};
    accentStyle: Style = {};
    descriptionStyle: Style = {};
    priceStyle: Style = {};
    title: string;
    accentTitle: string;
    description: string;
    price: string;
    link: string[];

    showPicture$ = new BehaviorSubject(false);

    @Input() set settings(value: SliderSettings) {
        if (value.title) {
            this.title = value.title;
        }
        if (value.link) {
            this.link = value.link;
        }
        if (value.accentTitle) {
            this.accentTitle = value.accentTitle;
        }
        if (value.description) {
            this.description = value.description;
        }
        if (value.price) {
            this.price = value.price;
        }
        if (value.backgroundColor) {
            this.wrapperStyle.backgroundColor =
                value.backgroundColor + value.backgroundColorOpacity ?? "ff";
        }

        if (value.backgroundPicture) {
            this.wrapperStyle.backgroundImage = `url("${value.backgroundPicture}")`;
        }

        if (value.imageFileName) {
            this.pictureStyle.backgroundImage = `url("/img/slider/${value.imageFileName}")`;
        }

        if (value.titleColor) {
            this.titleStyle.color = value.titleColor;
        }

        if (value.accentTitleColor) {
            this.accentStyle.color = value.accentTitleColor;
        }

        if (value.descriptionColor) {
            this.descriptionStyle.color = value.descriptionColor;
        }

        if (value.priceColor) {
            this.priceStyle.color = value.priceColor;
        }
    }

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        const obs = new ResizeObserver((entries) => {
            console.log("ResizeObserver:", entries);
            const ent = entries?.[0] ?? null;
            if (!ent) {
                return;
            }
            this.showPicture$.next(
                ent.contentRect.width > 640 &&
                    !!this.pictureStyle?.backgroundImage
            );
        });
        obs.observe(this.el.nativeElement);
    }

    ngOnDestroy() {}
}
