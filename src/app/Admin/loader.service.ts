import { Injectable, Output } from '@angular/core';

@Injectable()
export class LoaderService {



constructor() { }

private _state: boolean = false;
private _error: boolean = false;

public show(){
    setTimeout(()=>this._state = true, 1);
    //this._state = true;
    }

public hide(){
    setTimeout(()=>{ this._state = false;},500);
    //this._state = false;
    this.unsetError();
    }

public setError(){
    this._error = true;
}

public unsetError(){
    this._error = false;
}

public get state(): boolean{
    return this._state;
}

public get error(): boolean{
    return this._error;
}

}
