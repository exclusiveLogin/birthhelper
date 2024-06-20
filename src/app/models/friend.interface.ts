import { User } from "@models/user.interface";
import { Entity } from "@models/entity.interface";

export type BannedModel = Omit<FriendModel, "status"> & {
    status: BlockedStatus;
};
export type FriendStatus =
    | "approved"
    | "blocked"
    | "declined"
    | "pending"
    | "deleted";
export type BlockedStatus = "blocked";

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
    banned: ReturnType<Banned["getSnapshot"]>[];
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

    user?: User;
    target?: User | Entity;

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

export class Banned implements BannedModel {
    id: number;
    status: BlockedStatus;
    user_id: number;
    target_id: number;
    target_key: string;
    datetime_update: string;
    datetime_create: string;
    datetime_delete: string;

    user?: User;
    target?: User | Entity;

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
