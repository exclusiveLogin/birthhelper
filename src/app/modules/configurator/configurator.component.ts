import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SectionType} from 'app/services/search.service';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {SlotEntity} from 'app/models/entity.interface';
import {ValidationTreeItem} from '../../services/order.service';
import {TabFloorSetting} from 'app/modules/configurator/configurator.model';
import {UntilDestroy} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-configurator',
    templateUrl: './configurator.component.html',
    styleUrls: ['./configurator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    onTabsLoad$ = this.configuratorService.onTabsReady$.pipe(tap(tabs => console.log('TABS: ', tabs)));
    onView$ = this.configuratorService.onViewChanged$;

    getConsumerByID(key: string): Observable<SlotEntity[]> {
        return this.configuratorService.getConsumerByID(key);
    }

    getVisibilityFloor(floor: TabFloorSetting): Observable<boolean> {
        const consumerKeys = floor?.consumerKeys;
        return forkJoin(...[consumerKeys.map(k => this.getConsumerByID(k))]).pipe(
            map((data: SlotEntity[][]) => data.reduce((acc, cur) => [...acc, ...cur], [])),
            map((slots) => !!slots.length),
        );
    }

    selectTab(key: string): void {
        this.configuratorService.selectTab(key);
    }

    constructor(
        private configuratorService: ConfiguratorService,
        private ar: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.onInitData$.subscribe(([id, type, key]) => {
            this.configuratorService.currentContragentID$.next(id);
            this.configuratorService.currentContragentEntityKey$.next(key);
            this.configuratorService.currentSectionKey$.next(type);
        });
        this.configuratorService.selectFirstTab();
    }

    gotoSearch(): void {
        this.onInitSectionType$
            .subscribe(section =>
                this.router.navigate(['/system/search', section + 's'])
                    .then());
    }

    getFloorState(floorKey): Observable<ValidationTreeItem> {
        return this.configuratorService.getValidationStateFloorByKey(floorKey);
    }

}
