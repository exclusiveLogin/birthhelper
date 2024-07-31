import { User } from "@models/user.interface";
import { Entity } from "@models/entity.interface";
import { from, Observable } from "rxjs";
import { FriendService } from "@services/friend.service";
import { switchMap, take } from "rxjs/operators";

export type FriendStatus =
    | "approved"
    | "blocked"
    | "declined"
    | "pending"
    | "deleted";

export interface FriendModel {
    id: number;
    status: FriendStatus;
    user_id: number;
    target_id: number;
    target_key: string;
    datetime_update: string;
    datetime_create: string;
    datetime_delete: string;
}

export interface EditFriendRequest {
    status: FriendStatus;
}

export interface FriendMeta {
    active: {
        total: number;
        current: number;
    };
}

export interface FriendsRequestDTO {
    active: ReturnType<Friend["getSnapshot"]>[];
    offered: ReturnType<Friend["getSnapshot"]>[];
    pending: ReturnType<Friend["getSnapshot"]>[];
    banned: ReturnType<Friend["getSnapshot"]>[];
    blacklist: ReturnType<Friend["getSnapshot"]>[];
    meta?: {
        active: FriendMeta;
        offered: FriendMeta;
        banned: FriendMeta;
    };
}

export interface GetFriends {
    active: Friend[];
    offered: Friend[];
    pending: Friend[];
    banned: Friend[];
    blacklist: Friend[];
    meta?: {
        active: FriendMeta;
        offered: FriendMeta;
        banned: FriendMeta;
    };
}

export interface FriendStateDTO {
    isFriend: boolean;
    isOffered: boolean;
    isBlocked: boolean;
    isYourBanned: boolean;
    canFriendOffer: boolean;
    cantMessageMe: boolean;
}

export class Friend implements FriendModel {
    id: number;
    status: FriendStatus;
    user_id: number;
    target_id: number;
    target_key: string;
    datetime_update: string;
    datetime_create: string;
    datetime_delete: string;

    user?: Promise<User | Entity>;
    target?: Promise<User | Entity>;

    state: Promise<FriendStateDTO>;

    constructor(
        model: FriendModel,
        friendService: FriendService,
        selfUserId: number
    ) {
        Object.assign(this, model);

        const authorship = selfUserId === this.user_id;

        if (authorship) {
            this.user = friendService.getFriendshipUser(this.user_id);

            this.target = friendService.getFriendshipTarget(
                this.target_key,
                this.target_id
            );
        } else {
            this.user = friendService.getFriendshipTarget(
                this.target_key,
                this.target_id
            );

            this.target = friendService.getFriendshipUser(this.user_id);
        }
        console.log("Friend: ", this, authorship);
        this.state = this.target.then((target) =>
            friendService.checkFriendship(target.id).toPromise()
        );
    }

    getSnapshot() {
        return {
            id: this.id,
            status: this.status,
            user_id: this.user_id,
            target_id: this.target_id,
            target_key: this.target_key,
            datetime_update: this.datetime_update,
            datetime_create: this.datetime_create,
            datetime_delete: this.datetime_delete,

            user: this.user,
            target: this.target,
        };
    }
}
