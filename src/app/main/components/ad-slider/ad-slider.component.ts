import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface SliderSettings {
    id: string;
    imageFineName: string;
    backgroundColor: string;
    price?: string;
    title?: string;
    accentTitle?: string;
    description?: string;
    link?: string[];
}

@Component({
    selector: 'app-ad-slider',
    templateUrl: './ad-slider.component.html',
    styleUrls: ['./ad-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdSliderComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef) {
    }

    showPicture$ = new BehaviorSubject(false);

    ngOnInit(): void {
        const obs = new ResizeObserver((entries) => {
            console.log('ResizeObserver:', entries);
            const ent = entries?.[0] ?? null;
            if (!ent) { return; }
            this.showPicture$.next(ent.contentRect.width > 640);
        });
        obs.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
    }
}
