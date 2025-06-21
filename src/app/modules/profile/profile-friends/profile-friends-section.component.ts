import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile-friends-section',
  templateUrl: './profile-friends-section.component.html',
  styleUrls: ['./profile-friends-section.component.scss']
})
export class ProfileFriendsSectionComponent {
  @Input() title: string;
  @Input() count: number;
  @Input() items: any[];
  @Input() type: string;

  collapsed = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }
} 