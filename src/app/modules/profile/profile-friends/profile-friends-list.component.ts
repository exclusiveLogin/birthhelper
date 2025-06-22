import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Friend } from '@models/friend.interface';

@Component({
  selector: 'profile-friends-list',
  templateUrl: './profile-friends-list.component.html',
  styleUrls: ['./profile-friends-list.component.scss']
})
export class ProfileFriendsListComponent {
  @Input() items: Friend[];
  @Input() type: string;

  constructor(private router: Router, private ar: ActivatedRoute) {

  }

  async gotoUserPage(friend: Friend) {
    const user = await friend.target
    this.router.navigate(['../profile', user.id], {relativeTo: this.ar.parent});
  }
} 