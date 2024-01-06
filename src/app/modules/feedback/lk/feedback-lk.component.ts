import { Component } from '@angular/core';
import { AuthService } from '@modules/auth-module/auth.service';
import { LkService } from '@services/lk.service';

@Component({
  selector: 'app-feedback-lk',
  templateUrl: './feedback-lk.component.html',
  styleUrls: ['./feedback-lk.component.scss']
})
export class LkFeedbackComponent {
  selectedCTG$ = this.lkService.selectedContragents$;
  user$ = this.authService.user$;
  
  constructor(
      private lkService: LkService,
      private authService: AuthService
  ) {}

  filterChange(filters: any): void {
    filters = Object.entries(filters)
      .filter(filter => !!filter[1])
      .reduce((acc, filter) => ({...acc, [filter[0]]: filter[1]}), {});

    this.lkService.setFilters('feedback',filters);
  }
}
