import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SectionType} from 'app/services/data-provider.service';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Entity} from 'app/models/entity.interface';

@Component({
    selector: 'app-configurator',
    templateUrl: './configurator.component.html',
    styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {

    onInitContragentID$: Observable<number> = this.ar.paramMap
        .pipe(map(m => m.get('id') && Number(m.get('id') ?? null)));

    onInitSectionType$: Observable<SectionType> = this.ar.data
        .pipe(map(data => data.section as SectionType));

    onInitContragentEntityKey$: Observable<SectionType> = this.ar.data
        .pipe(map(data => data.entity_key as SectionType));

    onInitData$: Observable<[id: number, type: SectionType, key: string]> =
        combineLatest([this.onInitContragentID$, this.onInitSectionType$, this.onInitContragentEntityKey$]);

    onContragentLoad$ = this.configuratorService.onContragent$;
    onTabsLoad$ = this.configuratorService.onTabsReady$;
    onView$ = this.configuratorService.onViewChanged$;

    getConsumerByID(key: string): Observable<Entity[]> {
        return this.configuratorService.getConsumerByID(key);
    }

    selectTab(key: string): void {
        console.log('selectTab', key);
        this.configuratorService.selectTab(key);
    }

    constructor(
        private configuratorService: ConfiguratorService,
        private ar: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        // this.configuratorService.getSectionConfig(null)
        this.onInitData$.subscribe(([id, type, key]) => {
            this.configuratorService.currentContragentID$.next(id);
            this.configuratorService.currentContragentEntityKey$.next(key);
            this.configuratorService.currentSectionKey$.next(type);
        });
    }

    gotoSearch(): void {
        this.onInitSectionType$.subscribe(section => this.router.navigate(['/system/search', section + 's']).then());
    }

}
