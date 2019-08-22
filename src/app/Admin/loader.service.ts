import { Injectable, Output } from '@angular/core';

@Injectable()
export class LoaderService {



constructor() { }

private _state: boolean = false;

public show(){
    setTimeout(()=>this._state = true, 1);
    //this._state = true;
    }

public hide(){
    setTimeout(()=>{ this._state = false;},500);
    //this._state = false;
    }

public get state(): boolean{
    return this._state;
}

}
