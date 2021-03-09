import { Injectable, Output } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoaderService {



constructor() { }

private _state: boolean = false;
private _error: boolean = false;
private _error_str: string = null;

public show(){
    setTimeout(()=>this._state = true, 1);
    }

public hide(){
    setTimeout(()=> this._state = false, 1500);
    this.unsetError();
    }

public setError(text?: string){
    setTimeout(() => {
        this._error = true;
        this._error_str = text ? text : null;
    } , 1500);

}

public unsetError(){
    setTimeout(() => {
        this._error = false;
        this._error_str = null;
    } , 1);
}

public get state(): boolean{
    return this._state;
}

public get error(): boolean{
    return this._error;
}

public get errorText(): string{
    return this._error_str;
}

}
