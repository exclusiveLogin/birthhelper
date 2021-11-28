import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {DialogType} from './dialog.model';
import {hasher} from '../utils/hasher';
import {DialogService} from './dialog.service';
import {filter} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Subject} from 'rxjs';

@UntilDestroy()
@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {

    template: TemplateRef<any>;
    _showed$ = new Subject<boolean>();
    private _template_hash: string;
    private _mode: DialogType = 'popup';
    constructor(
        private cdr: ChangeDetectorRef,
        private dialogService: DialogService,
    ) {}
    @Input() id_dialog = 'main_app_dialog';

    tplData = {
        error_tpl: 'Целевой шаблон не задан',
        error_tpl_code: 'ERR_TPL_BLANK',
    };
    tpl_context = {
        $implicit: this.tplData,
    };
    @ViewChild('tpl_popup_placement', { static: true }) tpl_placement: TemplateRef<any>;
    @ViewChild('tpl_popup_person', { static: true }) tpl_person: TemplateRef<any>;
    @ViewChild('tpl_popup_other', { static: true }) tpl_other: TemplateRef<any>;
    @ViewChild('tpl_popup_blank', { static: true }) tpl_default: TemplateRef<any>;

    ngOnInit(): void {
        this.template = this.tpl_default;

        if (this.id_dialog) {
            this.dialogService.dialogBus$.pipe(
                filter(action => action.dialogKey === this.id_dialog),
                filter(action => !!action.mode && !!action.template),
                untilDestroyed(this),
            ).subscribe(action => {
                if (action.action === 'show') {
                    const _tpl = action.template || this[`tpl_${action.templateKey}`];
                    if (!_tpl) { return; }
                    switch (action.mode) {
                        case 'dialog':
                            this.showDialog(_tpl);
                            break;
                        case 'alert':
                            this.showAlert(_tpl);
                            break;
                        case 'popup':
                            this.showPopup(_tpl);
                            break;
                        case 'prompt':
                            this.showPrompt(_tpl);
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
    showAlert(tpl: TemplateRef<any>): void {
        this.installDialog(tpl, 'alert');
    }
    showPrompt(tpl: TemplateRef<any>): void {
        this.installDialog(tpl, 'prompt');
    }

    closeDialog(): void {
        this._showed$.next(false);
    }
    uninstallDialog(): void {
        this.template = null;
        this._template_hash = null;
        this._mode = 'popup';
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
        const hash = hasher(template);
        if (hash !== this._template_hash) {
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
}
