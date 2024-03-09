import { FormGroup } from "@angular/forms";
import { TemplateRef } from "@angular/core";
import { Subject } from "rxjs";

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
    size?: DialogSize;
}

export interface DialogServiceConfig {
    idDialog: string;
    mode: DialogType;
    data: any;
}

export type DialogSize = 'small' | 'middle' | 'x-middle' | 'large';
