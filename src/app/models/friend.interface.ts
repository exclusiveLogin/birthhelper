import { User } from "@models/user.interface";
import { Entity } from "@models/entity.interface";
import { RestService } from "@services/rest.service";

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

    constructor(model: FriendModel, rest: RestService, selfUserId: number) {
        Object.assign(this, model);

        const authorship = selfUserId === this.user_id;

        if (authorship) {
            this.user = rest
                .getEntity<User>("ent_users", this.user_id)
                .toPromise();
            this.target = rest
                .getEntity(this.target_key, this.target_id)
                .toPromise();
        } else {
            this.user = rest
                .getEntity(this.target_key, this.target_id)
                .toPromise();
            this.target = rest
                .getEntity<User>("ent_users", this.user_id)
                .toPromise();
        }
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
