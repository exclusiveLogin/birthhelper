import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

constructor() { }

    private apiBase = environment.baseUrl;

    private iconPath = 'icons';
    private filePath = 'uploads';

    public getApiPath(): string {
        return this.apiBase;
    }

    public getIconPath(): string {
        return this.iconPath;
    }
}
