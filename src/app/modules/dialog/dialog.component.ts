import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogType} from './dialog.model';
import {DialogService} from './dialog.service';
import {filter, tap} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {dialogAnimation, dialogWrapperAnimation} from './dialog.animation';
import {ImageService} from '../../services/image.service';
import {SafeUrl} from '@angular/platform-browser';
import {LLMap} from '@modules/map.lib';
import {icon, LatLng, marker, Marker} from 'leaflet';

@UntilDestroy()
@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [dialogWrapperAnimation, dialogAnimation],
})
export class DialogComponent implements OnInit {

    map: LLMap;
    template: TemplateRef<any>;
    _showed$ = new Subject<boolean>();
    tabIdx: number;
    _mode: DialogType = 'popup';
    constructor(
        private cdr: ChangeDetectorRef,
        private dialogService: DialogService,
        private imageService: ImageService,
    ) {}
    @Input() id_dialog = 'main_app_dialog';

    tplData = {
        error_tpl: 'Целевой шаблон не задан',
        error_tpl_code: 'ERR_TPL_BLANK',
    };
    tpl_context = {
        $implicit: this.tplData,
    };
    tpl_custom = false;

    @ViewChild('tpl_popup_placement', { static: true }) tpl_placement: TemplateRef<any>;
    @ViewChild('tpl_popup_person', { static: true }) tpl_person: TemplateRef<any>;
    @ViewChild('tpl_popup_other', { static: true }) tpl_other: TemplateRef<any>;
    @ViewChild('tpl_popup_contragent', { static: true }) tpl_contragent: TemplateRef<any>;
    @ViewChild('tpl_popup_blank', { static: true }) tpl_default: TemplateRef<any>;

    mapsExistTplKeys = [
        'contragent',
    ];

    photoUrl$: Observable<SafeUrl>;
    imageSignal$: BehaviorSubject<null>;

    hasMapTpl(key: string): boolean {
        return this.mapsExistTplKeys.includes(key) ?? null;
    }

    ngOnInit(): void {
        this.template = this.tpl_default;

        if (this.id_dialog) {
            this.dialogService.dialogBus$.pipe(
                filter(action => action.dialogKey === this.id_dialog),
                filter(action => action.action === 'close' || (!!action.mode && (!!action.template || !!action.templateKey))),
                tap(() => this.tabIdx = 0),
                untilDestroyed(this),
            ).subscribe(action => {
                if (action.action === 'show') {
                    this.tpl_custom = !!action.template;
                    const _tpl = action.template || this[`tpl_${action.templateKey}`];
                    this.tpl_context.$implicit = action.data;
                    if (this.imageSignal$) {
                        this.imageSignal$.complete();
                        this.imageSignal$ = null;
                        this.photoUrl$ = null;
                    }
                    const imgData = this.imageService.getImage$(action?.data?.photo);
                    this.photoUrl$ = imgData[0];
                    this.imageSignal$ = imgData[1];
                    const hasMap = action.templateKey ? this.hasMapTpl(action.templateKey) : null;
                    if (hasMap && action?.data?.position_lat && action?.data?.position_lon) {
                        setTimeout(() => {
                            const el = document.getElementById('dialog_viewport');
                            const mapEl = el?.querySelector('.map_container');
                            if (!mapEl) { return; }
                            this.map = new LLMap();
                            this.map.buildSimple(mapEl as HTMLElement);
                            const position = new LatLng(action.data.position_lat, action.data.position_lon);
                            marker(position, {
                                icon: icon({
                                    iconUrl: 'img/icons/hospital.png',
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 16],
                                }),
                            }).addTo(this.map.map);
                            this.map.fitByLatLonAnimate(
                                {lat: action.data.position_lat, lon: action.data.position_lon}, 200);
                        }, 200);
                    }

                    if (!_tpl) { return; }
                    switch (action.mode) {
                        case 'dialog':
                            this.showDialog(_tpl);
                            break;
                        case 'popup':
                            this.showPopup(_tpl);
                            break;
                    }
                }
                if (action.action === 'close') {
                    this.uninstallDialog();
                }
            });
        }
    }
    showDialog(tpl: TemplateRef<any>): void {
        this.installDialog(tpl, 'dialog');
    }
    showPopup(tpl: TemplateRef<any>): void {
        this.installDialog(tpl, 'popup');
    }

    closeDialog(): void {
        this._showed$.next(false);
    }
    uninstallDialog(): void {
        this.template = null;
        this.tpl_context.$implicit = this.tplData;
        this._mode = 'popup';
        if (this.map) {
            this.map.destroy();
        }
        this.closeDialog();
    }
    installDialog(tpl: TemplateRef<any>, mode: DialogType): void {
        const dialogUpdated = this.generateDialog(tpl);
        const modeUpdated = this.setDialogMode(mode);
        this._showed$.next(true);
        if (!!dialogUpdated || !!modeUpdated) {
            this.cdr.markForCheck();
        }
    }
    generateDialog(template: TemplateRef<any>): boolean {
        if (this.template !== template) {
            this.template = template;
            return true;
        }
        return false;
    }
    setDialogMode(mode: DialogType): boolean {
        if (this._mode !== mode) {
            this._mode = mode;
            return true;
        }
        return false;
    }

    setTabIdx(idx: number): void {
        this.tabIdx = idx;
        this.cdr.markForCheck();
    }
}
