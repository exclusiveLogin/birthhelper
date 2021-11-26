import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {DialogType} from './dialog.model';
import {hasher} from '../utils/hasher';
import {DialogService} from './dialog.service';
import {filter} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {

    template: TemplateRef<any>;
    private _template_hash: string;
    private _showed = false;
    private _mode: DialogType = 'popup';
    constructor(
        private cdr: ChangeDetectorRef,
        private dialogService: DialogService,
    ) {}
    @Input() id_dialog: string;

    ngOnInit(): void {
        if (this.id_dialog) {
            this.dialogService.dialogBus$.pipe(
                filter(action => action.dialogKey === this.id_dialog),
                filter(action => !!action.mode && !!action.template),
                untilDestroyed(this),
            ).subscribe(action => {
                switch (action.mode) {
                    case 'dialog':
                        this.showDialog(action.template);
                        break;
                    case 'alert':
                        this.showAlert(action.template);
                        break;
                    case 'popup':
                        this.showPopup(action.template);
                        break;
                    case 'prompt':
                        this.showPrompt(action.template);
                        break;
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
    installDialog(tpl: TemplateRef<any>, mode: DialogType): void {
        const dialogUpd = this.generateDialog(tpl);
        const modeUpdated = this.setDialogMode(mode);
        this._showed = true;
        if (!!dialogUpd || !!modeUpdated) {
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
