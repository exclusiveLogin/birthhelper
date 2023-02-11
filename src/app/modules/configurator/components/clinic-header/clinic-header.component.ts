import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Contragent, ContragentsPhone} from '../../../../models/contragent.interface';
import {BehaviorSubject, Observable, of, zip} from 'rxjs';
import {DialogServiceConfig} from '@modules/dialog/dialog.model';
import {DialogService} from '@modules/dialog/dialog.service';
import {map, mapTo, mergeMap, pluck, switchMap, tap} from 'rxjs/operators';
import {RestService} from '@services/rest.service';
import {FeedbackService} from '@modules/feedback/feedback.service';
import {SummaryVotes} from '@modules/feedback/models';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-clinic-header',
    templateUrl: './clinic-header.component.html',
    styleUrls: ['./clinic-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicHeaderComponent implements OnInit {

    _ctg: Observable<Contragent>;
    rating$: Observable<SummaryVotes>;
    refresher$ = new BehaviorSubject<null>(null);
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

        this.rating$ = this.refresher$.pipe(
            mergeMap(() => zip(this.ar.data.pipe(pluck('section')), this.ar.paramMap)
                .pipe(
                    map(([section, params]) => ({section, id: params.get('id')})),
                    switchMap(({section, id}) => this.feedbackService.getRatingForTarget(section, Number(id))),
                    map(({summary}) => (summary)),
                ))
        );
    }

    sendFeedback() {
        zip(this.ar.data.pipe(pluck('section')), this.ar.paramMap)
            .pipe(
                map(([section, params]) => ({section, id: Number(params.get('id'))})),
                switchMap(({section, id}) => this.feedbackService.initFeedbackByTarget(section, id, {})),
                tap(_ => this.refresher$.next(null)),
            ).toPromise();
    }
    constructor(
        private dialogService: DialogService,
        private restService: RestService,
        private feedbackService: FeedbackService,
        private ar: ActivatedRoute,
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
