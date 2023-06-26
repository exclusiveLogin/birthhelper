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
    this.lkService.setFilters('feedback',filters);
  }
}
