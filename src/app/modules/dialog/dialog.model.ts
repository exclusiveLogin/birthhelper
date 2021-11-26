import {FormGroup} from '@angular/forms';
import {TemplateRef} from '@angular/core';

export type DialogType = 'dialog' | 'alert' | 'prompt' | 'popup';

export interface DialogAction {
    dialogKey: string;
    action: 'show' | 'close' | 'submit' | 'reject';
    mode: DialogType;
    templateKey?: string;
    template?: TemplateRef<any>;
    data?: any;
    form?: FormGroup;
}

export interface DialogServiceConfig {
    idDialog: string;
    mode: DialogType;
}
