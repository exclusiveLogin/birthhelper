import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryRateByTargetResponse, Vote } from '../models';
import { ActivatedRoute } from '@angular/router';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import { RestService } from '@services/rest.service';
import { zip, Observable, forkJoin } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FeedbackService } from '../feedback.service';
import { AuthService } from '@modules/auth-module/auth.service';
import { Entity } from '@models/entity.interface';

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
    ) { }

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
    untilDestroyed(this),
  );

  listFeedbackByTarget$ = this.target$.pipe(
    filter(target => !!target.id && !!target.key),
    switchMap(target => this.feedbackService.getFeedbackListByTarget(target.key, target.id)),
    tap(list => console.log('get list fb by target: ', list)),
    untilDestroyed(this)
    );

  listFeedbackByUser$ = this.feedbackService.getFeedbackListByUser()
    .pipe(
      tap(list => console.log('get list fb by user: ', list)), 
      untilDestroyed(this),
    );

  mode$: Observable<'targetfeedback' | 'myfeedback'> = this.target$.pipe(map(target => target ? 'targetfeedback' : 'myfeedback'))

  isMyFeedbackMode$: Observable<boolean> = this.mode$.pipe(map(mode => mode === 'myfeedback'));
  isTargetFeedbackMode$: Observable<boolean> = this.mode$.pipe(map(mode => mode === 'targetfeedback'));

  targetData$: Observable<{target: Entity, rate: SummaryRateByTargetResponse}> = this.target$.pipe(
    switchMap(target => 
      forkJoin(
        [
          this.restService.getEntity<Entity>(target.key, target.id),
          this.feedbackService.getRatingForTarget(target.key, target.id)
        ]).pipe(map(([target, rate]) => ({target, rate }))),
        ))

  ngOnInit(): void {
    
  }

  isSelfOwner(user_id: number): boolean {
    return user_id ? this.authService.user?.id === user_id : false;
  }

  votes: Partial<Vote>[] = [
    {rate: 2, slug: 'test', title: 'Test1'},
    {rate: 1, slug: 'test', title: 'Test2'},
    {rate: 4, slug: 'test', title: 'Test3'},
    {rate: 3, slug: 'test', title: 'Test4'},
  ];

  user$ = this.restService.getUserById(1);
  user2$ = this.restService.getUserById(19);
  user3$ = this.restService.getUserById(20);
  user4$ = this.restService.getUserById(21);

  contragent$ = this.restService.getEntity('ent_clinic_contragents', 2);
}
