import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FriendService } from "@services/friend.service";
import { FriendStateDTO } from "@models/friend.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "@models/user.interface";

@Component({
    selector: "app-profile-friends",
    templateUrl: "./profile-friends.component.html",
    styleUrls: ["./profile-friends.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFriendsComponent {
    friends$ = this.friendService.getMyFriendList();
    banned$ = this.friendService.getMyBannedList();
    pending$ = this.friendService.getMyPendingList();
    offered$ = this.friendService.getMyOfferList();
    blacklist$ = this.friendService.getMyBlackList();

    constructor(
        private friendService: FriendService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    canSendMessage(state?: FriendStateDTO) {
        console.log(
            "canSendMessage",
            state,
            this.friendService.canSendMessage(state)
        );
        return this.friendService.canSendMessage(state);
    }

    gotoUserPage(user: User) {
        this.router
            .navigate(["..", user.id], {
                relativeTo: this.route,
            })
            .then((r) => {});
    }
}
