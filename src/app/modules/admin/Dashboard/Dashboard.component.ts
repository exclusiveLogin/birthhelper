import {Component, OnInit} from '@angular/core';
import {MenuService} from './menu.service';

export enum EMENUMODE {
    'CREATE',
    'EDIT',
    'DELETE',
    'VIEW',
}

export interface IMenuGroupItem {
    title: string;
    key: string;
    list: IMenuRepoItem[];
}
export interface IMenuRepoItem {
    name: string;
    containerKey?: string;
    slotKey?: string;
    title: string;
    titleVoc: string;
    titleVocs: string;
    type: string;
    mime?: string;
    modes: EMENUMODE[];
    isDict?: boolean;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './Dashboard.component.html',
    styleUrls: ['./Dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    public selectedMenu: IMenuRepoItem;
    public selectedMode: EMENUMODE;

    public readonly menuRepo: IMenuGroupItem[] = [
        {
            key: 'common',
            title: 'Общее',
            list: [
                {
                name: 'ent_contragents',
                title: 'Контрагенты',
                titleVoc: 'Контрагента',
                titleVocs: 'Контрагентов',
                type: 'entity',
                modes: [
                    EMENUMODE.VIEW,
                    EMENUMODE.CREATE,
                    EMENUMODE.EDIT,
                    EMENUMODE.DELETE,
                ]
            },
                {
                    name: 'ent_doctor',
                    title: 'Специалисты',
                    titleVoc: 'специалиста',
                    titleVocs: 'специалисты',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.EDIT,
                        EMENUMODE.DELETE,
                    ]
                },
                {
                    name: 'ent_services',
                    title: 'Услуги',
                    titleVoc: 'услугу',
                    titleVocs: 'услуги',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.EDIT,
                        EMENUMODE.DELETE,
                    ]
                },
                {
                    name: 'ent_service_containers',
                    containerKey: 'container_services',
                    title: 'Контейнеры услуг',
                    titleVoc: 'контейнер',
                    titleVocs: 'контейнера',
                    type: 'container',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_phones',
                    title: 'Телефоны системы',
                    titleVoc: 'телефон',
                    titleVocs: 'телефоны',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.EDIT,
                        EMENUMODE.DELETE,
                    ]
                },
                {
                    name: 'ent_phone_containers',
                    containerKey: 'container_phones',
                    title: 'Контейнеры телефонов',
                    titleVoc: 'контейнер',
                    titleVocs: 'контейнера',
                    type: 'container',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_images',
                    title: 'Изображения системы',
                    titleVoc: 'изображение',
                    titleVocs: 'изображения',
                    type: 'entity',
                    mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
            ],
        },
        {
            key: 'clinic',
            title: 'Роддома',
            list: [
                {
                    name: 'ent_clinics',
                    title: 'Роддома',
                    titleVoc: 'роддом',
                    titleVocs: 'роддома',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.EDIT,
                        EMENUMODE.DELETE,
                    ]
                },
                {
                    name: 'ent_facilities_containers',
                    containerKey: 'container_facilities',
                    title: 'Контейнеры удобств в клиниках',
                    titleVoc: 'контейнер',
                    titleVocs: 'контейнера',
                    type: 'container',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_specialities_clinic_containers',
                    containerKey: 'container_specialities',
                    title: 'Контейнеры специализаций клиник',
                    titleVoc: 'контейнер',
                    titleVocs: 'контейнера',
                    type: 'container',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_placement_slots',
                    slotKey: 'slot_placement',
                    title: 'Слоты услуг размещения',
                    titleVoc: 'слот',
                    titleVocs: 'слота',
                    type: 'slot',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_doctor_slots',
                    slotKey: 'slot_doctors',
                    title: 'Слоты услуг персонала',
                    titleVoc: 'слот',
                    titleVocs: 'слота',
                    type: 'slot',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_birth_type_slots',
                    slotKey: 'slot_doctors',
                    title: 'Слоты видов родов',
                    titleVoc: 'слот',
                    titleVocs: 'слота',
                    type: 'slot',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_birth_additional_slots',
                    slotKey: 'slot_doctors',
                    title: 'Слоты дополнительных услуг',
                    titleVoc: 'слот',
                    titleVocs: 'слота',
                    type: 'slot',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_services_placement',
                    title: 'Палаты',
                    titleVoc: 'палату',
                    titleVocs: 'палат',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.EDIT,
                        EMENUMODE.DELETE,
                    ]
                },
            ],
        },
        {
            key: 'consultation',
            title: 'Женские консультации',
            list: [
                {
                    name: 'ent_consultations',
                    title: 'Женские консультации',
                    titleVoc: 'консультацию',
                    titleVocs: 'консультаций',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.EDIT,
                        EMENUMODE.DELETE,
                    ]
                },
                {
                    name: 'ent_consultation_doctor_slots',
                    title: 'Специалисты',
                    titleVoc: 'специалиста',
                    titleVocs: 'специалистов',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_birth_support_consultation_slots',
                    title: 'Услуги ведения беременности',
                    titleVoc: 'услугу',
                    titleVocs: 'услуг',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_multi_pregnant_slots',
                    title: 'Услуги ведения многоплодной беременности',
                    titleVoc: 'услугу',
                    titleVocs: 'услуг',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_online_consultation_slots',
                    title: 'Услуги онлайн консультаций',
                    titleVoc: 'услугу',
                    titleVocs: 'услуг',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_eco_consultation_slots',
                    title: 'Услуги ведения ЭКО беременности',
                    titleVoc: 'услугу',
                    titleVocs: 'услуг',
                    type: 'entity',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
            ],
        },
        {
            key: 'dictionary',
            title: 'Словари',
            list: [
                {
                    name: 'ent_birthtype',
                    title: 'Виды родов(словарь)',
                    titleVoc: 'вид родов',
                    titleVocs: 'виды родов',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_doctor_position',
                    title: 'Должности врачей(словарь)',
                    titleVoc: 'должность',
                    titleVocs: 'должности',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_doctor_category',
                    title: 'Категории врачей(словарь)',
                    titleVoc: 'категория',
                    titleVocs: 'категории',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_specialities_clinic',
                    title: 'Специализация клиник(словарь)',
                    titleVoc: 'специализация',
                    titleVocs: 'специализации',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_facilities',
                    title: 'Удобства клиник(словарь)',
                    titleVoc: 'удобство',
                    titleVocs: 'удобства',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_slot_category_type',
                    title: 'Вид услуги клиник(словарь)',
                    titleVoc: 'услуга',
                    titleVocs: 'услуги',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                        EMENUMODE.CREATE,
                        EMENUMODE.DELETE,
                        EMENUMODE.EDIT,
                    ]
                },
                {
                    name: 'ent_order_status_type',
                    title: 'Статус заказа(словарь)',
                    titleVoc: 'заказ',
                    titleVocs: 'заказы',
                    type: 'entity',
                    isDict: true,
                    // mime: 'image',
                    modes: [
                        EMENUMODE.VIEW,
                    ]
                }
            ],
        },
    ];


    constructor(private menuService: MenuService) {
    }

    ngOnInit() {

        this.menuService.menuStream$.subscribe(menu => this.selectedMenu = menu);

        this.menuService.submenuStream$.subscribe(mode => this.selectedMode = mode);
    }


}
