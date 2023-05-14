import { Component, OnInit } from '@angular/core';
import { Vote } from '../models';
import { ActivatedRoute } from '@angular/router';
import {map, filter} from 'rxjs/operators';
import { User } from '@models/user.interface';
import { RestService } from '@services/rest.service';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.scss']
})
export class FeedbackPageComponent implements OnInit {

  constructor(
    private ar: ActivatedRoute,
    private restService: RestService,
    ) { }

  targetKey$ = this.ar.queryParams.pipe(
    filter(params => params.key),
    map(params => params.key)
  );

  targetId$ = this.ar.queryParams.pipe(
    filter(params => params.id),
    map(params => params.id)
  );

  ngOnInit(): void {
    
  }

  votes: Partial<Vote>[] = [
    {rate: 2, slug: 'test', title: 'Test1'},
    {rate: 1, slug: 'test', title: 'Test2'},
    {rate: 4, slug: 'test', title: 'Test3'},
    {rate: 3, slug: 'test', title: 'Test4'},
    {rate: 5, slug: 'test', title: 'Test5'},
    {rate: 2, slug: 'test', title: 'Test6'},
    {rate: 5, slug: 'test', title: 'Test7'},
    {rate: 2, slug: 'test', title: 'Test8'},
    {rate: 3, slug: 'test', title: 'Test9'},
  ];

  user$ = this.restService.getUserById(1);
  user2$ = this.restService.getUserById(19);
  user3$ = this.restService.getUserById(20);
  user4$ = this.restService.getUserById(21);

  contragent$ = this.restService.getEntity('ent_clinic_contragents', 2);
}
