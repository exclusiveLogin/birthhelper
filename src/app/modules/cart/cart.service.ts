import {Injectable} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor(
        private rest: RestService,
    ) {
    }

    getUserOrders(): Observable<any> {
        return ;
    }
}
