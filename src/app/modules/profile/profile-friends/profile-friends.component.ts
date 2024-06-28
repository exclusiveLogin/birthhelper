import { ChangeDetectionStrategy, Component } from "@angular/core";
import { User } from "@models/user.interface";
import { FriendService } from "@services/friend.service";

@Component({
    selector: "app-profile-friends",
    templateUrl: "./profile-friends.component.html",
    styleUrls: ["./profile-friends.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFriendsComponent {
    mockUser = new User({
        id: 1,
        first_name: "Test",
        last_name: "Rest",
        login: "Admin",
    });

    friends$ = this.friendService.getMyFriendList();
    banned$ = this.friendService.getMyBannedList();
    pending$ = this.friendService.getMyPendingList();
    offered$ = this.friendService.getMyOfferList();
    blacklist$ = this.friendService.getMyBlackList();

    constructor(private friendService: FriendService) {}

    protected readonly User = User;
    protected readonly Promise = Promise;
}
