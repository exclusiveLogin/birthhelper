import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';
import {ActivatedRoute} from '@angular/router';
import {SectionType} from 'app/services/data-provider.service';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ConfiguratorConfigSrc} from 'app/modules/configurator/configurator.model';

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

    onInitData$: Observable<[id: number, type: SectionType]> = combineLatest([this.onInitContragentID$, this.onInitSectionType$]);

    constructor(
        private configuratorService: ConfiguratorService,
        private ar: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        // this.configuratorService.getSectionConfig(null)
        this.onInitData$.subscribe(([id, key]) => {
            this.configuratorService.setContragentID(id);
            this.configuratorService.loadConfig(key);
        });
    }


}
