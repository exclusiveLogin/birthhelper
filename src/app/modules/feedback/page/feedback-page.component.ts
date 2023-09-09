import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FeedbackResponse, FeedbackSet, SummaryRateByTargetResponse } from '../models';
import { ActivatedRoute } from '@angular/router';
import {filter, map, shareReplay, switchMap, tap,} from 'rxjs/operators';
import { RestService } from '@services/rest.service';
import { zip, Observable, BehaviorSubject, NEVER, merge, Subject, combineLatest, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FeedbackService } from '../feedback.service';
import { AuthService } from '@modules/auth-module/auth.service';
import { Entity } from '@models/entity.interface';
import { DialogService } from '@modules/dialog/dialog.service';
import { FeedbackContext } from '@models/context';

@UntilDestroy()
@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPageComponent implements OnInit {

  constructor(
    private ar: ActivatedRoute,
    private restService: RestService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private dialogService: DialogService,
    ) { }

  filtersChange$ = new BehaviorSubject<any>({});
  pageChange$ = new Subject<number>();
  pages: number;
  limit = 20;
  skip = 0;

  // update the feedbacks
  updater$ = new Subject<null>();
  setUpdater$ = new Subject<null>();
  onUpdateList$ = merge(this.updater$, this.pageChange$);
  onUpdateSet$ = merge(this.setUpdater$, this.filtersChange$)

  targetKey$ = this.ar.queryParams.pipe(
    map(params => params.key),
    untilDestroyed(this),
  );

  targetId$ = this.ar.queryParams.pipe(
    map(params => params.id),
    untilDestroyed(this),
  );

  target$ = zip(this.targetKey$, this.targetId$).pipe(
    map(params => (params[0] &&  params[1]) ? ({key: params[0], id: params[1]}) : null),
    tap((data) => console.log('target: ', data)), 
    shareReplay(1),
    untilDestroyed(this),
  );

  setByUserList$ = this.feedbackService.fetchFeedbackSetByUser(this.filtersChange$.value);

  setByTargetList$ = this.target$.pipe(
    switchMap(({key, id}) => this.feedbackService.fetchFeedbackSetByTarget(key, id, this.filtersChange$.value)),
  );

  onSetChanged$ = this.onUpdateSet$.pipe(
    switchMap(() => this.mode$.pipe(switchMap(mode => {
      switch(mode){
        case 'myfeedback':
          return this.setByUserList$;
        case 'targetfeedback':
          return this.setByTargetList$;
        default: return NEVER;
      }
    }))),
    tap((_set) => this.setPageMetadata(_set))
  );

  // LIST //////////////////////////////////////////////////////////////////////////
  listFeedbackByTarget$ = this.onUpdateList$.pipe(
    switchMap(() => this.target$),
    filter((target) => !!target.id && !!target.key),
    switchMap((target) => this.feedbackService.getFeedbackListByTarget(target.key, target.id, {...this.filtersChange$.value, limit: this.limit, skip: this.skip})),
    tap(list => console.log('get list fb by target: ', list)),
    untilDestroyed(this)
    );

  listFeedbackByUser$ = this.onUpdateList$.pipe(
    switchMap(() => this.feedbackService.getFeedbackListByUser({...this.filtersChange$.value, limit: this.limit, skip: this.skip})),
    tap(list => console.log('get list fb by user: ', list)), 
    untilDestroyed(this),
  );
  ////////////////////////////////////////////////////////////////////////

  mode$: Observable<'targetfeedback' | 'myfeedback'> = this.target$.pipe(map(target => target ? 'targetfeedback' : 'myfeedback'))

  isMyFeedbackMode$: Observable<boolean> = this.mode$.pipe(map(mode => mode === 'myfeedback'));
  isTargetFeedbackMode$: Observable<boolean> = this.mode$.pipe(map(mode => mode === 'targetfeedback'));

  targetData$: Observable<Entity> = this.target$.pipe(
    switchMap(target => this.restService.getEntity<Entity>(target.key, target.id)));

  rating$: Observable<SummaryRateByTargetResponse> = combineLatest(this.target$, merge(of(null), this.updater$)).pipe(
    map(([target]) => target),
    switchMap(target => this.feedbackService.getRatingForTarget(target.key, target.id)));

  ngOnInit(): void {
  }

  setPageMetadata(_set: FeedbackSet): void {
    console.log('setPageMetadata', _set);
    this.limit = _set.portion;
    this.pages = Math.ceil(_set.total / _set.portion ?? 20) || 1;
    this.pageChanged(1);
  }

  pageChanged(page: number): void {
    this.skip =  (this.limit * (page - 1)),
    this.pageChange$.next(page);
  }

  changeFilters(filters): void {
    console.log('changeFilters before', filters);
    const _filters = Object.entries(filters)
      .filter(filter => !!filter[1])
      .reduce((acc, filter) => ({...acc, [filter[0]]: filter[1]}), {});

    this.filtersChange$.next(_filters);
    console.log('changeFilters after', this.filtersChange$.value);
    }

  ////////////////////////////////////////////////////////////////

  isSelfOwner(user_id: number): boolean {
    return user_id ? this.authService.user?.id === user_id : false;
  }

  ////////////////////////////////////////////////////////////////

  editFeedback(feedback: FeedbackResponse): void {
    const feedbackContext: FeedbackContext = {
      existFeedback: feedback,
      section: feedback.section,
    }

    this.feedbackService.initFeedbackByTarget(feedback.target_entity_key, feedback.target_entity_id, feedbackContext)
    .then(async (result) => {
        this.updater$.next(null);
    });
  }

  deleteFeedback(feedback_id: number): void {
    this.dialogService.showDialogByTemplateKey('prompt', {
      data: {
        text: 'Вы уверены что хотите удалить этот отзыв?',
        submit: 'Удалить',
        cancel: 'Отмена',
      }
    }).then(async () => {
      console.log('deleteFeedback', feedback_id);
      await this.feedbackService.deleteFeedback(feedback_id).toPromise();
      this.setUpdater$.next(null);
      this.updater$.next(null);
    }).catch((error) => {
      console.log('deleteFeedback error: ', error);
    });
  }

  setLike(feedback_id: number, invert = false): void {
    this.feedbackService.sendRateToFeedback(feedback_id, invert)
    .then(async () => {
      console.log('sendRateFeedback', feedback_id, invert);
      this.updater$.next(null);
    }).catch((error) => {
      console.log('sendRateFeedback error: ', error);
    });;
  }

}
