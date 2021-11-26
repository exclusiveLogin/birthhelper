import {Injectable, TemplateRef} from '@angular/core';
import {DialogAction, DialogServiceConfig, DialogType} from './dialog.model';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    default_id_dialog: string;
    default_mode: DialogType;
    constructor() {
    }
    _sender$ = new Subject<DialogAction>();
    dialogBus$: Observable<DialogAction> = this._sender$.pipe();
    configDefault(config: Partial<DialogServiceConfig>): void {
        this.default_id_dialog = config.idDialog ?? this.default_id_dialog;
        this.default_mode = config.mode ?? this.default_mode;
    }
    showDialogByTemplate(template: TemplateRef<any>, dialogId?: string, mode?: DialogType): void {}
    showDialogByTemplateKey(templateKey: string, dialogId?: string, mode?: DialogType): void {}

    closeOpenedDialog(dialogId?: string): void {}
    validateAndSend(action: DialogAction): void {
        const _action: DialogAction = {
            dialogKey: action.dialogKey ?? this.default_id_dialog,
            action: action.action,
            mode: action.mode ?? this.default_mode,
            template: action.template,
            data: action.data,
            form: action.form,
            templateKey: action.templateKey,
        };

        const validOptions = _action.action && _action.dialogKey && _action.mode;
        const validTemplate = _action.template || _action.templateKey;
        const validIfRX = _action.mode === 'dialog'
            ? _action.form && _action.data
            : true;

        if (validOptions && validTemplate && validIfRX) {
            this.sendAction(_action);
        }
    }
    sendAction(action: DialogAction): void {
        this._sender$.next(action);
    }

}
