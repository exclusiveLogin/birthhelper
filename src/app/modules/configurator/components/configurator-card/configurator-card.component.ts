import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SelectedState, TabFloorSetting} from 'app/modules/configurator/configurator.model';
import {SlotEntity} from 'app/models/entity.interface';
import {environment} from '@environments/environment';
import {PersonBuilder, PersonDoctorSlot} from 'app/models/doctor.interface';
import {PlacementBuilder, PlacementSlot} from 'app/models/placement.interface';
import {CardSlot, ConfiguratorCardBuilder} from 'app/models/cardbuilder.interface';
import {ConfiguratorService} from '../../configurator.service';
import {map, tap} from 'rxjs/operators';
import {Observable, combineLatest} from 'rxjs';
import {DialogService} from '../../../dialog/dialog.service';
import {DialogServiceConfig} from '../../../dialog/dialog.model';

@Component({
    selector: 'app-configurator-card',
    templateUrl: './configurator-card.component.html',
    styleUrls: ['./configurator-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorCardComponent implements OnInit {

    url = `${environment.static}/'noimage'`;
    viewEnt: SlotEntity | PersonDoctorSlot | PlacementSlot;
    selectionState: SelectedState;
    onSelectionChanges$ = this.configuratorService.onSelection$.pipe(
        tap(() => this.refreshSelectionState()));

    @Input() public cardType: TabFloorSetting['entityType'] = 'other';
    @Input() public active: boolean;
    @Input() public tabKey: string;
    @Input() public floorKey: string;
    @Input() public sectionKey: string;

    @Input() set entity(data: SlotEntity) {
        this.viewEnt = this.viewEnt ? this.viewEnt :
            this.cardType === 'person' ? PersonBuilder.serialize(data as PersonDoctorSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt :
            this.cardType === 'placement' ? PlacementBuilder.serialize(data as PlacementSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt :
            this.cardType === 'other' ? ConfiguratorCardBuilder.serialize(data as CardSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt : data;

        this.url = this.viewEnt.photo_url;
        this.refreshSelectionState();
    }

    isLocked$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    constructor(
        private configuratorService: ConfiguratorService,
        private dialogService: DialogService,
    ) {
    }

    refreshSelectionState(): void {
        this.selectionState = this.configuratorService.getSelectedStateByEntity(this.viewEnt);
    }
    selectCard(): void {
        this.configuratorService.selectItem(
            this.viewEnt,
            this.tabKey,
            this.floorKey,
            this.sectionKey,
        );
    }

    openInPopup(): void {
        const cfg: Partial<DialogServiceConfig> = {
            mode: 'popup',
            data: this.viewEnt,
        };
        this.dialogService.showDialogByTemplateKey(this.cardType, cfg);
    }

    ngOnInit(): void {
        this.isLocked$ = combineLatest([
            this.configuratorService.getValidationStateTabByKey(this.tabKey),
            this.configuratorService.getValidationStateFloorByKey(this.floorKey),
        ]).pipe(
            map(data => data.reduce((locked, cur) => locked || (cur?.locked ?? false), false)),
        );
        this.isInvalid$ = combineLatest([
            this.configuratorService.getValidationStateTabByKey(this.tabKey),
            this.configuratorService.getValidationStateFloorByKey(this.floorKey),
        ]).pipe(
            map(data => data.reduce((invalid, cur) =>
                invalid || (cur?.status === 'rich' || cur?.status === 'poor'), false)),
        );
    }

}
