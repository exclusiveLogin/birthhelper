import { Injectable } from '@angular/core';
import {DialogService} from '@modules/dialog/dialog.service';
import {FeedbackContext} from '@models/context';
import {ISettingsParams, RestService} from '@services/rest.service';
import {DictionaryService} from '@services/dictionary.service';
import {CreateFeedbackRequest, FeedbackFormDataAnswer, SummaryRateByTargetResponse, Vote, VoteResponse} from '@modules/feedback/models';
import {DialogServiceConfig} from '@modules/dialog/dialog.model';
import {StoreService} from '@modules/feedback/store.service';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AuthService} from '@modules/auth-module/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService extends StoreService {

  constructor(private dialog: DialogService, private rest: RestService, private dict: DictionaryService, private authService: AuthService) {
      super();
  }

    async initFeedbackByTarget(targetKey: string, targetId: number, context: FeedbackContext) {
      const role = await this.authService.getCurrentRole().toPromise();

      const filters: Record<string, string> = {
          ...(context.feedbackEntityType ? { feedback_entity_type: context.feedbackEntityType} : {}),
          ...(context.section ? { section: context.section} : {}),
          ...(context.slotCategoryType ? { slot_category_type: context.slotCategoryType.toString()} : {}),
      };
      try {
          if (role.slug === 'guest') {
              await this.dialog.showDialogByTemplateKey('registration_suggestion', {data: {subtitle: 'Оставлять отзывы могут только авторизованные пользователи сайта'}});
              return ;
          }
          const votes = await this.dict.getDict('dict_votes', filters).toPromise();
          const result = await this.openFeedbackDialog(votes as unknown as Vote[]);
          const feedbackData = result.data as FeedbackFormDataAnswer;
          const feedbackSaveResponse: CreateFeedbackRequest = {
              target_entity_id: targetId,
              target_entity_key: targetKey,
              votes: feedbackData?.votes as VoteResponse[] ?? [],
              comment: feedbackData?.comment ?? '',
              action: 'CREATE',
          };
          console.log('feedback success', feedbackSaveResponse);
          return this.sendFeedback(feedbackSaveResponse);
      } catch (e) {
          console.log('feedback failed', e);
      }
    }

    openFeedbackDialog(votes: Vote[]) {
      const dialogConfiguration: Partial<DialogServiceConfig> = {
          data: {votes},
      };
      return this.dialog.showDialogByTemplateKey('feedback_form', dialogConfiguration);

    }

    sendFeedback(feedback: CreateFeedbackRequest): Promise<unknown> {
      const restSetting: ISettingsParams = {
          mode: 'api',
          segment: 'feedback',
      };

      return this.rest.postData(restSetting, feedback)
          .pipe(
              tap(_ => this.clearStoreByTarget(feedback.target_entity_key, feedback.target_entity_id))
          ).toPromise();
    }


    fetchRatingForTarget(targetKey: string, targetId: number): Observable<SummaryRateByTargetResponse>  {
        const restSetting: ISettingsParams = {
            mode: 'api',
            segment: 'feedback',
            script: 'stats'
        };

        const data = {key: targetKey, id: targetId.toString()};
        return this.rest.fetchData(restSetting, data, true);
    }

    getRatingForTarget(targetKey: string, targetId: number): Observable<SummaryRateByTargetResponse>  {
      const rating = this.loadFromStore(targetKey, targetId);
      return rating ? of(rating) : this.fetchRatingForTarget(targetKey, targetId)
          .pipe(
              tap(data => this.saveToStore(targetKey, targetId, data)));
    }
}
