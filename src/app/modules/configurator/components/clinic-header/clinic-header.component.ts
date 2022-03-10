import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Contragent, ContragentsPhone} from '../../../../models/contragent.interface';
import {Observable, of} from 'rxjs';
import {DialogServiceConfig} from '@modules/dialog/dialog.model';
import {DialogService} from '@modules/dialog/dialog.service';
import {map, mapTo, switchMap} from 'rxjs/operators';
import {RestService} from '@services/rest.service';

@Component({
    selector: 'app-clinic-header',
    templateUrl: './clinic-header.component.html',
    styleUrls: ['./clinic-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicHeaderComponent implements OnInit {

    _ctg: Observable<Contragent>;
    @Input() set contragent$(value: Observable<Contragent>) {
        this._ctg = value.pipe(
            switchMap(ctg => ctg.phone_container_id
                ? this.restService.getContainerFromId('container_phones', ctg.phone_container_id).pipe(
                    map(container => ctg.phones = container?.items as ContragentsPhone[] ?? []),
                    mapTo(ctg),
                )
                : of(ctg)
            )
        );
    }

    constructor(
        private dialogService: DialogService,
        private restService: RestService,
    ) {
    }

    ngOnInit(): void {
    }

    openInPopup(ctg: Contragent): void {
        ctg.photo = ctg.meta.image_id;
        const cfg: Partial<DialogServiceConfig> = {
            mode: 'popup',
            data: ctg,
        };
        this.dialogService.showDialogByTemplateKey('contragent', cfg);
    }

}
