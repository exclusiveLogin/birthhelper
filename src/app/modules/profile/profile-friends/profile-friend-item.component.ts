import { Component, Input } from '@angular/core';
import { FriendService } from '@services/friend.service';
import { Router } from '@angular/router';
// ВАЖНО: Не забудьте добавить CommonModule в imports модуля, где объявлен этот компонент!

@Component({
  selector: 'profile-friend-item',
  templateUrl: './profile-friend-item.component.html',
  styleUrls: ['./profile-friend-item.component.scss']
})
export class ProfileFriendItemComponent {
  @Input() item: any;
  @Input() type: string;

  constructor(public friendService: FriendService, private router: Router) {}

  accept() {
    this.friendService.acceptUserFriendship(this.item.id).subscribe(() => this.friendService.refresh());
  }

  decline() {
    this.friendService.removeFriendship(this.item.id).subscribe(() => this.friendService.refresh());
  }

  block() {
    this.friendService.blockUserByUserId(this.item.id).subscribe(() => this.friendService.refresh());
  }

  unblock() {
    this.friendService.unblockUserByOfferId(this.item.id).subscribe(() => this.friendService.refresh());
  }

  remove() {
    this.friendService.removeFriendship(this.item.id).subscribe(() => this.friendService.refresh());
  }

  message() {
    this.router.navigate(['/chat', this.item.id]);
  }

  gotoUserPage(user: any) {
    this.router.navigate(['/profile', user.id]);
  }
} 