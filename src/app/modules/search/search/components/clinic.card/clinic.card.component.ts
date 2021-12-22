import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IClinicMini} from 'app/models/clinic.interface';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ImageService} from '../../../../../services/image.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-clinic-card',
    templateUrl: './clinic.card.component.html',
    styleUrls: ['./clinic.card.component.scss']
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
    private set clinic(data: IClinicMini) {
        this.viewClinic = data;
        const imgData = this.imageService.getImage$(data.photo);
        this.photoUrl$ = imgData[0];
        this.imageSignal$ = imgData[1];
    }

    @Output() private gotoMap = new EventEmitter<IClinicMini>();

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
        this.gotoMap.next(this.viewClinic);
    }

    gotoConfigurator(): void {
        this.router.navigate(['/system/configurator/clinic', this.viewClinic.id]).then();
    }
}
