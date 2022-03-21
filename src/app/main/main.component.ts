import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../modules/auth-module/auth.service';
import {SliderSettings} from './components/ad-slider/ad-slider.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {

    path = location.pathname;
    banner1_test: SliderSettings = {
        id: '1',
        title: 'Тестовый баннер 1',
        accentTitle: 'Какое то акцентное описание баннера или услуги',
        description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
        price: '15000р',
        imageFileName: 'doctor1.png',
        backgroundColor: '#ffbcfc',
        backgroundColorOpacity: 'ee',
        accentTitleColor: '#ff2626',
        priceColor: '#ff4eb8',
        link: ['/'],
    };
    banner2_test: SliderSettings = {
        id: '2',
        title: 'Тестовый баннер 2',
        accentTitle: 'Какое то акцентное описание баннера или услуги',
        description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
        price: '35000р',
        imageFileName: 'doctor2.png',
        backgroundColor: '#10599e',
        backgroundColorOpacity: 'ee',
        accentTitleColor: '#c6e6ff',
        titleColor: '#a5d8fd',
        descriptionColor: '#fde4a5',
        priceColor: '#5ce7ff',
        link: ['/'],
    };

    constructor( public auth: AuthService) {
    }

    ngOnInit(): void {
    }

}
