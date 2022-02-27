import {Injectable, TemplateRef} from '@angular/core';
import {DialogAction, DialogServiceConfig, DialogType} from './dialog.model';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    default_id_dialog = 'main_app_dialog';

    default_mode: DialogType = 'popup';

    constructor() {
    }

    _sender$ = new Subject<Partial<DialogAction>>();
    dialogBus$: Observable<Partial<DialogAction>> = this._sender$.pipe();

    configDefault(config: Partial<DialogServiceConfig>): void {
        this.default_id_dialog = config.idDialog ?? this.default_id_dialog;
        this.default_mode = config.mode ?? this.default_mode;
    }
    showDialogByTemplate(template: TemplateRef<any>, cfg?: Partial<DialogServiceConfig>): void {
        this.validateAndSend({
            template,
            templateKey: null,
            mode: cfg?.mode,
            action: 'show',
            dialogKey: cfg?.idDialog,
            form: null,
            data: cfg?.data ?? {},
        });
    }
    showDialogByTemplateKey(templateKey: string, cfg?: Partial<DialogServiceConfig>): void {
        this.validateAndSend({
            template: null,
            templateKey,
            mode: cfg?.mode,
            action: 'show',
            dialogKey: cfg?.idDialog,
            form: null,
            data: cfg?.data ?? {},
        });
    }

    closeOpenedDialog(dialogKey?: string): void {
        this.sendAction({
            action: 'close',
            mode: 'dialog',
            dialogKey,
        });
    }
    validateAndSend(action: DialogAction): void {
        const _action: DialogAction = {
            dialogKey: action.dialogKey ?? this.default_id_dialog,
            template: action.template,
            templateKey: action.templateKey,
            action: action.action,
            mode: action.mode ?? this.default_mode,
            data: action.data,
            form: action.form,
        };

        const validOptions = _action.action && _action.dialogKey && _action.mode && _action.data;
        const validTemplate = _action.template || _action.templateKey;

        if (validOptions && validTemplate) {
            this.sendAction(_action);
        } else {
            console.log('Dialog ERROR', 'valid: opt, tpl, form',
                validOptions,
                validTemplate);
        }
    }
    sendAction(action: Partial<DialogAction>): void {
        this._sender$.next(action);
    }

}
