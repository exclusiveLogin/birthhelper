import { Component, Input } from '@angular/core';
import { FriendService } from '@services/friend.service';
import { Router } from '@angular/router';
import { Friend } from '@models/friend.interface';
// ВАЖНО: Не забудьте добавить CommonModule в imports модуля, где объявлен этот компонент!

@Component({
  selector: 'profile-friend-item',
  templateUrl: './profile-friend-item.component.html',
  styleUrls: ['./profile-friend-item.component.scss']
})
export class ProfileFriendItemComponent {
  @Input() item: Friend;
  @Input() type: string;

  constructor(public friendService: FriendService, private router: Router) {}

  async accept(event: Event) {
    event.stopPropagation();
    await this.friendService.acceptUserFriendship(this.item.id);
  }

  async decline(event: Event) {
    event.stopPropagation();
    await this.friendService.removeFriendship(this.item.id);
  }

  async block(event: Event, id: number) {
    event.stopPropagation();
    await this.friendService.blockUserByUserId(id);
  }

  async unblock(event: Event) {
    event.stopPropagation();
    await this.friendService.unblockUserByOfferId(this.item.id);
  }

  async remove(event: Event) {
    event.stopPropagation();
    await this.friendService.removeFriendship(this.item.id);
  }

  message() {
    this.router.navigate(['/chat', this.item.id]);
  }
} 