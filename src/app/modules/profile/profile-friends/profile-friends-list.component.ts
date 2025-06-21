import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile-friends-list',
  templateUrl: './profile-friends-list.component.html',
  styleUrls: ['./profile-friends-list.component.scss']
})
export class ProfileFriendsListComponent {
  @Input() items: any[];
  @Input() type: string;
} 