import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, shareReplay, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class RoutingService {
    constructor(private ar: ActivatedRoute, private router: Router) {
        this.routeData$.subscribe();
    }

    routeData$ = this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.collector(this.ar)),
        tap((data) => console.log("routeData$: ", data)),
        shareReplay(1)
    );

    collector(r: ActivatedRoute): any {
        let data = { ...(r?.snapshot?.data ?? {}) };
        const ejector = (_: ActivatedRoute): ActivatedRoute => _?.firstChild;
        let target = ejector(r);
        while (target) {
            data = { ...data, ...(target?.snapshot?.data ?? {}) };
            target = ejector(target);
        }
        return data;
    }
}
