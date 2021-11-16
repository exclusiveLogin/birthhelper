import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SectionType} from './search.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(
        private restService: RestService,
    ) {
    }

    doOrdersRefresh$ = new Subject<null>();
    doListRefresh$ = new Subject<null>();
    doCheckProducts$ = new Subject<null>();
    doPriceRecalculate$ = new Subject<null>();

    onPriceChanged$ = this.doPriceRecalculate$.pipe();
    onOrderListChanged$ = this.doPriceRecalculate$.pipe();
    onOrdersProductRefreshed$ = this.doPriceRecalculate$.pipe();

    fetchProductFactory(): Observable<any> {
        return;
    }

    smartRefresher(): void {

    }

    getPriceByContragent(section: SectionType, id: number): Observable<any> {
        return ;
    }

    addIntoCart(slotKey: string, slotId: number): void {

    }
}
