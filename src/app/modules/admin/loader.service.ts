import { Injectable, Output } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoaderService {



constructor() { }

private _state = false;
private _error = false;
private _error_str: string = null;

public show() {
    setTimeout(() => this._state = true, 1);
    }

public hide() {
    setTimeout(() => this._state = false, 1500);
    this.unsetError();
    }

public setError(err: { error: string, message: string  } | string = 'Unknown Error') {
    setTimeout(() => {
        this._error = true;
        this._error_str = typeof err === 'string' ? err :  err?.error || err.message;
    } , 1500);

}

public unsetError() {
    setTimeout(() => {
        this._error = false;
        this._error_str = null;
    } , 1);
}

public get state(): boolean {
    return this._state;
}

public get error(): boolean {
    return this._error;
}

public get errorText(): string {
    return this._error_str;
}

}
