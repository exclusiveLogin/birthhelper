import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {ImageService} from '../../../../../services/image.service';
import {SafeUrl} from '@angular/platform-browser';
import {IConsultationMini} from '@models/consultation.interface';
import {Entity} from '@models/entity.interface';

@Component({
    selector: 'app-consultation-card',
    templateUrl: './consultation.card.component.html',
    styleUrls: ['./consultation.card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultationCardComponent implements OnInit {

    viewConsultation: IConsultationMini = {
        id: -1,
        address: 'Не найден',
        title: 'Пустая женская консультация',
        photo: null,
        lon: null,
        lat: null,
        description: 'Какое то описание тестовой консультации',
        stat_value: 0,
        stat_count: 0,
        price_from: 0,
        price_until: 0,
        features: {
            eco: null,
            multi_birth: null,
            home_visit: null,
        },
        pathology: {
            onko: null,
            mioms: null,
            hypoxy: null,
            avo: null,
            gestos: null,
            anomaly_evolution: null,
            anemy: null,
        },
    };
    photoUrl$: Observable<SafeUrl>;
    imageSignal$: BehaviorSubject<null>;

    @Input()
    private set clinic(data: Entity) {
        this.viewConsultation = data as IConsultationMini;
        const imgData = this.imageService.getImage$(data.photo);
        this.photoUrl$ = imgData[0];
        this.imageSignal$ = imgData[1];
    }

    @Output() private gotoMap = new EventEmitter<IConsultationMini>();

    wrapped = false;

    constructor(
        private router: Router,
        private imageService: ImageService,
    ) {}

    wrap(): void {
        this.wrapped = true;
    }

    ngOnInit(): void {
    }

    showClinicOnMap(): void {
        this.gotoMap.next(this.viewConsultation);
    }

    gotoConfigurator(): void {
        this.router.navigate(['/system/configurator/consultation', this.viewConsultation.id]).then();
    }
}