import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

constructor() { }

    private apiBase = 'http://birthhelper.ru/';

    private iconPath = 'icons';

    public getApiPath(): string {
        return this.apiBase;
    }

    public getIconPath(): string {
        return this.iconPath;
    }
}
