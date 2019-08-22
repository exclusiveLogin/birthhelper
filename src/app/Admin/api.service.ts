import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

constructor() { }

    private apiBase = environment.baseUrl;//'http://localhost';//'http://91.240.87.153';

    private iconPath = 'icons';

    public getApiPath(): string {
        return this.apiBase;
    }

    public getIconPath(): string {
        return this.iconPath;
    }
}
