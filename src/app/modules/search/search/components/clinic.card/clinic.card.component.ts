import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IClinicMini} from 'app/models/clinic.interface';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {ImageService} from '../../../../../services/image.service';
import {SafeUrl} from '@angular/platform-browser';
import {Entity} from '@models/entity.interface';
import {FeedbackService} from '@modules/feedback/feedback.service';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {SummaryVotes} from '@modules/feedback/models';

@Component({
    selector: 'app-clinic-card',
    templateUrl: './clinic.card.component.html',
    styleUrls: ['./clinic.card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicCardComponent implements OnInit {

    viewClinic: IClinicMini = {
        id: -1,
        address: 'Не найден',
        title: 'Пустая клиника',
        photo: null,
        lon: null,
        lat: null,
        description: 'Какое то описание тестовой клиники',
        stat_value: 0,
        stat_count: 0,
        price_from: 0,
        price_until: 0,
        features: {
            status_iho: null,
            stat_male: 0,
            stat_female: 0,
            mom_with_baby: null,
            license: null,
            has_reanimation: null,
            has_consultation: null,
            has_oms: null,
            has_dms: null,
            free_meets: null,
            foreign_service: null,
        }
    };
    photoUrl$: Observable<SafeUrl>;
    imageSignal$: BehaviorSubject<null>;

    @Input()
    private set clinic(data: Entity) {
        this.viewClinic = data as IClinicMini;
        const imgData = this.imageService.getImage$(data.photo);
        this.photoUrl$ = imgData[0];
        this.imageSignal$ = imgData[1];
    }

    @Output() private gotoMap = new EventEmitter<IClinicMini>();

    wrapped = false;

    constructor(
        private router: Router,
        private imageService: ImageService,
        private feedbackService: FeedbackService,
    ) {}

    refresher$ = new BehaviorSubject<null>(null);
    rating$: Observable<SummaryVotes> = this.refresher$.pipe(
        switchMap(() => this.feedbackService.getRatingForTarget('clinic', this.viewClinic.id)),
        map(result => result.summary),
        shareReplay(1)
    );

    sendFeedback(): void {
        this.feedbackService.initFeedbackByTarget('clinic', this.viewClinic.id, {section: 'clinic'}).then(r => {
            console.log('feedback saved', r);
            this.refresher$.next(null);
        } );
    }
    wrap(): void {
        this.wrapped = true;
    }

    ngOnInit(): void {
    }

    showClinicOnMap(): void {
        this.gotoMap.next(this.viewClinic);
    }

    gotoConfigurator(): void {
        this.router.navigate(['/system/configurator/clinic', this.viewClinic.id]).then();
    }
}
