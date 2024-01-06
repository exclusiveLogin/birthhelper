import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-rate-button',
  templateUrl: './rate-button.component.html',
  styleUrls: ['./rate-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateButtonComponent implements OnInit {

  rateText: string = 'NA';
  bgcolor: string = 'grey';

  @Input() set rate(value: number) {
    this.rateText = value?.toFixed(1) ?? 'NA';
    if ( !value ){
      this.bgcolor = 'grey';
      return;
    } 
    if (value <= 1) {
      this.bgcolor = '#007bff';
      return;
    }
    if (value <= 2.5) {
      this.bgcolor = '#e73f08';
      return;
    }
    if (value <= 3.4) {
      this.bgcolor = '#af8c00';
      return;
    }
    if (value <= 4.2) {
      this.bgcolor = '#99af00';
      return;
    }
    if (value > 4.2) {
      this.bgcolor = '#10af00';
      return;
    }

  };

  constructor() { }

  ngOnInit(): void {
  }

}
