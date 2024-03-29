import { Injectable, TemplateRef } from "@angular/core";
import {
    DialogAction,
    DialogAnswer,
    DialogServiceConfig,
    DialogType,
} from "./dialog.model";
import { Observable, Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Injectable({
    providedIn: "root",
})
export class DialogService {
    default_id_dialog = "main_app_dialog";

    default_mode: DialogType = "popup";

    constructor() {}

    _sender$ = new Subject<Partial<DialogAction>>();
    dialogBus$: Observable<Partial<DialogAction>> = this._sender$.pipe(
        untilDestroyed(this),
        shareReplay(1)
    );

    configDefault(config: Partial<DialogServiceConfig>): void {
        this.default_id_dialog = config.idDialog ?? this.default_id_dialog;
        this.default_mode = config.mode ?? this.default_mode;
    }
    showDialogByTemplate(
        template: TemplateRef<any>,
        cfg?: Partial<DialogServiceConfig>
    ): Promise<DialogAnswer> {
        const dialogAnswerPipe$ = new Subject<DialogAnswer>();
        this.validateAndSend({
            template,
            templateKey: null,
            mode: cfg?.mode,
            action: "show",
            dialogKey: cfg?.idDialog,
            form: null,
            data: cfg?.data ?? {},
            dialogAnswerPipe$,
        });

        return dialogAnswerPipe$.toPromise();
    }
    showDialogByTemplateKey(
        templateKey: string,
        cfg?: Partial<DialogServiceConfig>
    ): Promise<DialogAnswer> {
        const dialogAnswerPipe$ = new Subject<DialogAnswer>();
        this.validateAndSend({
            template: null,
            templateKey,
            mode: cfg?.mode,
            action: "show",
            dialogKey: cfg?.idDialog,
            form: null,
            data: cfg?.data ?? {},
            dialogAnswerPipe$,
        });

        return dialogAnswerPipe$.toPromise();
    }

    closeOpenedDialog(dialogKey?: string): void {
        this.sendAction({
            action: "close",
            mode: "dialog",
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
            dialogAnswerPipe$: action.dialogAnswerPipe$,
        };

        const validOptions =
            _action.action && _action.dialogKey && _action.mode && _action.data;
        const validTemplate = _action.template || _action.templateKey;

        if (validOptions && validTemplate) {
            this.sendAction(_action);
        } else {
            console.log(
                "Dialog ERROR",
                "valid: opt, tpl, form",
                validOptions,
                validTemplate
            );
        }
    }
    sendAction(action: Partial<DialogAction>): void {
        this._sender$.next(action);
    }
}
