import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateComponent implements OnInit {
  bgcolor = 'grey';
  rateText: number;
  @Input() size = '64px';
  @Input() set rate ( value: number ) {
    this.rateText = value;
    if ( !value ){
      this.bgcolor = 'grey';
      return;
    } 
    if (value <= 1) {
      this.bgcolor = '#72061077';
      return;
    }
    if (value <= 2.5) {
      this.bgcolor = '#72290677';
      return;
    }
    if (value <= 3.4) {
      this.bgcolor = '#9b740877';
      return;
    }
    if (value <= 4.2) {
      this.bgcolor = '#5c720677';
      return;
    }
    if (value > 4.2) {
      this.bgcolor = '#06722c77';
      return;
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
