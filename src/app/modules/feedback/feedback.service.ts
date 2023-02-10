import { Injectable } from '@angular/core';
import {DialogService} from '@modules/dialog/dialog.service';
import {FeedbackContext} from '@models/context';
import {RestService} from '@services/rest.service';
import {DictionaryService} from '@services/dictionary.service';
import {CreateFeedbackRequest, FeedbackFormDataAnswer, Vote, VoteResponse} from '@modules/feedback/models';
import {DialogServiceConfig} from '@modules/dialog/dialog.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private dialog: DialogService, private rest: RestService, private dict: DictionaryService) { }

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

    }
}
