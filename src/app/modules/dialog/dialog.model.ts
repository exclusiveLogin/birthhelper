import { FormGroup } from "@angular/forms";
import { TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { VoteResponse } from "@modules/feedback/models";

export type DialogType = "dialog" | "popup";
export type DialogActionType = "show" | "close" | "submit" | "reject";
export interface DialogAnswer {
    action: DialogActionType;
    data: Record<string, any>;
    templateKey: string;
}

export interface DialogAction {
    dialogKey: string;
    action: DialogActionType;
    mode?: DialogType;
    templateKey?: string;
    template?: TemplateRef<any>;
    data?: any;
    form?: FormGroup;
    dialogAnswerPipe$: Subject<DialogAnswer>;
}

export interface DialogServiceConfig {
    idDialog: string;
    mode: DialogType;
    data: any;
}
