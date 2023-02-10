import {Component, OnInit} from '@angular/core';
import {FeedbackService} from '@modules/feedback/feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private fb: FeedbackService) {
    }
    ngOnInit(): void {
    }
}
