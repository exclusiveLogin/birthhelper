import { Injectable } from "@angular/core";
import { DialogService } from "@modules/dialog/dialog.service";
import { FeedbackContext } from "@models/context";
import { ISettingsParams, RestService } from "@services/rest.service";
import { DictionaryService } from "@services/dictionary.service";
import {
    CreateFeedbackRequest,
    FeedbackByContragentResponse,
    FeedbackFormDataAnswer,
    FeedbackRemoveResponse,
    FeedbackResponse,
    FeedbackStatus,
    FeedbackSummaryVotes,
    SummaryRateByTargetResponse,
    Vote,
    VoteResponse,
} from "@modules/feedback/models";
import { DialogServiceConfig } from "@modules/dialog/dialog.model";
import { StoreService } from "@modules/feedback/store.service";
import { Observable, of, forkJoin } from "rxjs";
import { tap, switchMap, map } from "rxjs/operators";
import { AuthService } from "@modules/auth-module/auth.service";
import { SectionType } from "@services/search.service";
import { Entitized, Entity } from "@models/entity.interface";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class FeedbackService extends StoreService {
    constructor(
        private dialog: DialogService,
        private rest: RestService,
        private dict: DictionaryService,
        private authService: AuthService,
        private toast: ToastrService,
    ) {
        super();
    }

    targetKeyMapper(targetKey): string {
        const TMap: { [key in SectionType]: string } = {
            clinic: 'ent_clinic_contragents',
            consultation: 'ent_consultation_contragents',
        };

        return TMap[targetKey] ?? targetKey;
    }

    async initFeedbackByTarget(
        targetKey: string,
        targetId: number,
        context: FeedbackContext
    ) {
        targetKey = this.targetKeyMapper(targetKey);
        const role = await this.authService.getCurrentRole().toPromise();

        const filters: Record<string, string> = {
            ...(context.feedbackEntityType
                ? { feedback_entity_type: context.feedbackEntityType }
                : {}),
            ...(context.section ? { section: context.section } : {}),
            ...(context.slotCategoryType
                ? { slot_category_type: context.slotCategoryType.toString() }
                : {}),
        };
        try {
            if (role.slug === "guest") {
                await this.dialog.showDialogByTemplateKey(
                    "registration_suggestion",
                    {
                        data: {
                            subtitle:
                                "Оставлять отзывы могут только авторизованные пользователи сайта",
                        },
                    }
                );
                return;
            }
            const votes = await this.dict
                .getDict("dict_votes", filters)
                .toPromise();
            const result = await this.openFeedbackDialog(
                votes as unknown as Vote[]
            );
            const feedbackData = result.data as FeedbackFormDataAnswer;
            const feedbackSaveResponse: CreateFeedbackRequest = {
                target_entity_id: targetId,
                target_entity_key: targetKey,
                votes: (feedbackData?.votes as VoteResponse[]) ?? [],
                comment: feedbackData?.comment ?? "",
                action: "CREATE",
                section: context.section,
            };
            return this.sendFeedback(feedbackSaveResponse);
        } catch (e) {
            console.log("feedback failed", e);
        }
    }

    openFeedbackDialog(votes: Vote[]) {
        const dialogConfiguration: Partial<DialogServiceConfig> = {
            data: { votes },
        };
        return this.dialog.showDialogByTemplateKey(
            "feedback_form",
            dialogConfiguration
        );
    }

    sendFeedback(feedback: CreateFeedbackRequest): Promise<unknown> {
        const restSetting: ISettingsParams = {
            mode: "api",
            segment: "feedback",
        };

        return this.rest
            .postData(restSetting, feedback)
            .pipe(
                tap((_) =>
                    this.clearStoreByTarget(
                        feedback.target_entity_key,
                        feedback.target_entity_id
                    )
                )
            )
            .toPromise().catch(error => {
                if(error.status === 429) {
                    this.toast.error('Вы уже недавно оставляли отзыв на этот объект, попробуйте позже');
                }
            });
    }

    fetchRatingForTarget(
        targetKey: string,
        targetId: number
    ): Observable<SummaryRateByTargetResponse> {
        const restSetting: ISettingsParams = {
            mode: "api",
            segment: "feedback",
            script: "stats",
        };

        const data = { key: targetKey, id: targetId.toString() };
        return this.rest.fetchData(restSetting, data, true);
    }

    getRatingForTarget(
        targetKey: string,
        targetId: number
    ): Observable<SummaryRateByTargetResponse> {
        const rating = this.loadFromStore(targetKey, targetId);
        return rating
            ? of(rating)
            : this.fetchRatingForTarget(targetKey, targetId).pipe(
                  tap((data) => this.saveToStore(targetKey, targetId, data))
              );
    }

    getFeedbackListByTarget(
        targetKey: string,
        targetId: number,
        filters = {}
    ): Observable<FeedbackResponse[]> {
        const restSetting: ISettingsParams = {
            mode: "api",
            segment: "feedback",
            script: "list",
        };

        const data = { key: targetKey, id: targetId.toString() };
        return this.rest.fetchData<FeedbackResponse[]>(restSetting, data, true).pipe(
            map(fblist => fblist.filter(f => !!f.target_entity_id && !!f.target_entity_key)),
            map(fblist => fblist.filter(f => !!f.votes?.length)),
            map(fblist => fblist.map(f => this.summaryVotesEnreacher(f))),
        );
    }

    getFeedbackListByUser(filters = {}): Observable<(FeedbackResponse & FeedbackSummaryVotes & Entitized)[]> {
        const restSetting: ISettingsParams = {
            mode: "api",
            segment: "feedback",
            script: "listbyuser",
        };

        const data = { ...filters };
        return this.rest.fetchData<FeedbackResponse[]>(restSetting, data, true).pipe(
            map(fblist => fblist.filter(f => !!f.target_entity_id && !!f.target_entity_key)),
            map(fblist => fblist.filter(f => !!f.votes?.length)),
            map(fblist => fblist.map(f => this.summaryVotesEnreacher(f))),
            switchMap((fblist) => fblist.length ? forkJoin(fblist.map((f) => this.getTargetEntity(f))) : of([])),
        );
    }

    getTargetEntity(feedback: FeedbackResponse & FeedbackSummaryVotes): Observable<FeedbackResponse & Entitized & FeedbackSummaryVotes> {
        return this.rest.getEntity<Entity>(feedback.target_entity_key, feedback.target_entity_id)
            .pipe(
                map(
                    (ent) => ({...feedback, _entity: ent})
                )
            );
    }

    summaryVotesEnreacher(feedback: FeedbackResponse): FeedbackResponse & FeedbackSummaryVotes {
        return {
            ...feedback,
            _summary: {
                total: feedback?.votes?.length,
                min: Math.min(...feedback?.votes?.map((v) => v.rate), 0),
                max: Math.max(...feedback?.votes?.map((v) => v.rate), 0),
                avr: feedback?.votes?.reduce((acc, v) => (v?.rate ?? 0) + acc, 0) / feedback?.votes?.length,
            }
        }
    }

    getFeedbackListByContragent(
        contragentId: number,
        section: SectionType,
        status: FeedbackStatus
    ): Observable<FeedbackByContragentResponse> {
        const restSetting: ISettingsParams = {
            mode: "api",
            segment: "feedback",
            resource: "listbycontragent",
            script: contragentId.toString(),
        };

        let data = { section, status } as {};
        data = Object.entries(data)
            .filter(filter => !!filter[1])
            .reduce((acc, filter) => ({...acc, [filter[0]]: filter[1]}), {});
        
        debugger;

        return this.rest.fetchData(restSetting, data, true);
    }

    addFeedback(): void {}
    replyFeedback(): void {}

    deleteFeedback(feedbackId: number): Observable<FeedbackRemoveResponse> {
        const restSetting: ISettingsParams = {
            mode: "api",
            segment: "feedback",
            resource: `${feedbackId}`,
        };

        return this.rest.remData(restSetting);
    }
}
