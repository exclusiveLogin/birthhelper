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

@Injectable({
  providedIn: 'root'
})
export class FeedbackService extends StoreService {

  constructor(private dialog: DialogService, private rest: RestService, private dict: DictionaryService) {
      super();
      console.log('Feedback INIT');
      this.initFeedbackByTarget('consultation', 1, {});


  }

    async initFeedbackByTarget(targetKey: string, targetId: number, context: FeedbackContext) {
      const filters: Record<string, string> = {
          ...(context.feedbackEntityType ? { feedback_entity_type: context.feedbackEntityType} : {}),
          ...(context.section ? { section: context.section} : {}),
          ...(context.slotCategoryType ? { slot_category_type: context.slotCategoryType.toString()} : {}),
      };
      try {
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

          this.sendFeedback(feedbackSaveResponse);
          console.log('feedback success', feedbackSaveResponse);

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

    sendFeedback(feedback: CreateFeedbackRequest): void {
      const restSetting: ISettingsParams = {
          mode: 'api',
          segment: 'feedback',
      };

      this.rest.postData(restSetting, feedback).toPromise();
    }


    fetchRatingForTarget(targetKey: string, targetId: number): Observable<SummaryRateByTargetResponse>  {
        const restSetting: ISettingsParams = {
            mode: 'api',
            segment: 'feedback',
            script: 'stats'
        };

        const data = {key: targetKey, id: targetId.toString()};
        return this.rest.fetchData(restSetting, data);
    }

    getRatingForTarget(targetKey: string, targetId: number): Observable<SummaryRateByTargetResponse>  {
      const rating = this.loadFromStore(targetKey, targetId);
      return rating ? of(rating) : this.fetchRatingForTarget(targetKey, targetId)
          .pipe(
              tap(data => this.saveToStore(targetKey, targetId, data)));
    }
}
