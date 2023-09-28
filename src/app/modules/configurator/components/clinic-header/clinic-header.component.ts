import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import {
    Contragent,
    ContragentsPhone,
} from "../../../../models/contragent.interface";
import { BehaviorSubject, forkJoin, merge, Observable, of, zip } from "rxjs";
import { DialogServiceConfig } from "@modules/dialog/dialog.model";
import { DialogService } from "@modules/dialog/dialog.service";
import { catchError, map, mapTo, mergeMap, pluck, shareReplay, switchMap, tap } from "rxjs/operators";
import { RestService } from "@services/rest.service";
import { FeedbackService } from "@modules/feedback/feedback.service";
import { SummaryVotes } from "@modules/feedback/models";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

const sectionKeyMapper = (key: string): string | null => {
    const SMap: { [key: string]: string } = {
      clinic: "ent_clinic_contragents",
      consultation: "ent_consultation_contragents",
    };

    return SMap[key];
  }

@UntilDestroy()
@Component({
    selector: "app-clinic-header",
    templateUrl: "./clinic-header.component.html",
    styleUrls: ["./clinic-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicHeaderComponent implements OnInit {
    _ctg: Observable<Contragent>;
    rating$: Observable<SummaryVotes>;
    refresher$ = new BehaviorSubject<null>(null);
    section$ = this.ar.data.pipe(pluck("section")).pipe(shareReplay(1));
    params$ = this.ar.paramMap.pipe(shareReplay(1));

    @Input() set contragent$(value: Observable<Contragent>) {
        this._ctg = value.pipe(
            switchMap((ctg) =>
                ctg.phone_container_id
                    ? this.restService
                          .getContainerFromId(
                              "container_phones",
                              ctg.phone_container_id
                          )
                          .pipe(
                                catchError(err => of(null)),
                              map(
                                  (container) =>
                                      (ctg.phones =
                                          (container?.items as ContragentsPhone[]) ??
                                          [])
                              ),
                              mapTo(ctg)
                          )
                    : of(ctg)
            ),
            untilDestroyed(this),
        );

        this.rating$ = merge(this.refresher$, of(null)).pipe(
            mergeMap(() =>
                zip(this.section$, this.params$).pipe(
                    map(([section, params]) => ({
                        section: sectionKeyMapper(section),
                        id: params.get("id"),
                    })),
                    switchMap(({ section, id }) =>
                        this.feedbackService.getRatingForTarget(
                            section,
                            Number(id)
                        )
                    ),
                    map(({ summary }) => summary)
                )
            ),
            untilDestroyed(this),
        );
    }

    sendFeedback() {
        zip(this.section$, this.params$)
            .pipe(
                map(([section, params]) => ({
                    section,
                    id: Number(params.get("id")),
                })),
                switchMap(({ section, id }) =>
                    this.feedbackService.initFeedbackByTarget(
                        `ent_${section}_contragents`,
                        id,
                        {
                            section,
                        }
                    )
                ),
                tap((_) => this.refresher$.next(null)),
                untilDestroyed(this),
            )
            .toPromise();
    }
    constructor(
        private dialogService: DialogService,
        private restService: RestService,
        private feedbackService: FeedbackService,
        private ar: ActivatedRoute
    ) {}

    ngOnInit(): void {}

    openInPopup(ctg: Contragent): void {
        ctg.photo = ctg.meta.image_id;
        const cfg: Partial<DialogServiceConfig> = {
            mode: "popup",
            data: ctg,
        };
        this.dialogService.showDialogByTemplateKey("contragent", cfg);
    }

    async gotoRatingPage() {
        await zip(this.params$, this.section$).pipe(
            map(([params, section]) => ({section: section, id: parseInt(params.get('id'))})),
            tap((params) => this.feedbackService.gotoRatingPage(params.section, params.id)),
            untilDestroyed(this),
        ).toPromise()
    }
}
