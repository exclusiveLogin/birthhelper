import { Injectable } from "@angular/core";
import {
    Friend,
    FriendModel,
    FriendsRequestDTO,
    FriendStateDTO,
    FriendStatus,
    GetFriends,
} from "@models/friend.interface";
import { OkPacket } from "@models/order.interface";
import { BehaviorSubject, merge, Observable, OperatorFunction } from "rxjs";
import { ISettingsParams, RestService } from "@services/rest.service";
import { map, pluck, shareReplay, switchMap } from "rxjs/operators";
import { AuthService } from "@modules/auth-module/auth.service";
import { User } from "@models/user.interface";
import { Entity } from "@models/entity.interface";

export interface BlockUserResponse {
    success: boolean;
    id: number;
    userId: number;
}

@Injectable({
    providedIn: "root",
})
export class FriendService {
    _updaterFriendList: BehaviorSubject<void> = new BehaviorSubject<void>(
        void 0
    );
    myFriends$: Observable<GetFriends>;

    constructor(
        private restService: RestService,
        private authService: AuthService
    ) {
        console.log("FriendService", this);
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
        };
        this.myFriends$ = merge(this._updaterFriendList).pipe(
            switchMap(() =>
                this.restService.fetchData<FriendsRequestDTO>(
                    params,
                    null,
                    true
                )
            ),
            this.friendMapper(),
            shareReplay(1)
        );
    }

    friendMapper(): OperatorFunction<FriendsRequestDTO, GetFriends> {
        return map(
            ({
                active,
                pending,
                offered,
                banned,
                blacklist,
                ...meta
            }): GetFriends => {
                return {
                    active: active.map(
                        (friend: FriendModel) =>
                            new Friend(friend, this, this.authService.user.id)
                    ),
                    banned: banned.map(
                        (friend: FriendModel) =>
                            new Friend(friend, this, this.authService.user.id)
                    ),
                    offered: offered.map(
                        (friend: FriendModel) =>
                            new Friend(friend, this, this.authService.user.id)
                    ),
                    pending: pending.map(
                        (friend: FriendModel) =>
                            new Friend(friend, this, this.authService.user.id)
                    ),
                    blacklist: blacklist.map(
                        (friend: FriendModel) =>
                            new Friend(friend, this, this.authService.user.id)
                    ),
                };
            }
        );
    }

    getFriendshipUser(id: number): Promise<User> {
        return this.restService.getEntity<User>("ent_users", id).toPromise();
    }

    getFriendshipTarget(key: string, id: number): Promise<Entity> {
        return this.restService.getEntity<Entity>(key, id).toPromise();
    }

    getMyFriendList(): Observable<Friend[]> {
        return this.myFriends$.pipe(pluck("active"));
    }

    getMyBannedList(): Observable<Friend[]> {
        return this.myFriends$.pipe(pluck("banned"));
    }

    getMyOfferList(): Observable<Friend[]> {
        return this.myFriends$.pipe(pluck("offered"));
    }

    getMyPendingList(): Observable<Friend[]> {
        return this.myFriends$.pipe(pluck("pending"));
    }

    getMyBlackList(): Observable<Friend[]> {
        return this.myFriends$.pipe(pluck("blacklist"));
    }

    getFriedsByUserId(userId: number): Observable<GetFriends> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            script: userId.toString(),
        };

        return this.restService
            .fetchData<FriendsRequestDTO>(params)
            .pipe(this.friendMapper());
    }

    sendFriendship(
        userId: number
    ): Observable<{ success: boolean; result: OkPacket }> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
        };

        const data: {
            friend_id: number;
        } = {
            friend_id: userId,
        };

        return this.restService.postData(params, data);
    }

    acceptUserFriendship(
        id: number
    ): Observable<{ success: boolean; result: OkPacket }> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            script: id.toString(),
        };

        const status: FriendStatus = "approved";
        return this.restService.patchData(params, { status });
    }

    removeFriendship(
        id: number
    ): Observable<{ success: boolean; result: OkPacket }> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            script: id.toString(),
        };

        return this.restService.remData(params);
    }

    checkFriendship(friendId: number): Observable<FriendStateDTO> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            resource: "check",
            script: friendId.toString(),
        };

        return this.restService.fetchData(params, null, true);
    }

    getBlockedUsersByUserId(userId: number): Friend[] {
        return;
    }

    blockUserByUserId(userId: number): Observable<BlockUserResponse> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            resource: "block",
            script: userId.toString(),
        };

        return this.restService.postData<BlockUserResponse>(params);
    }

    unblockUserByOfferId(id: number): Observable<BlockUserResponse> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            resource: "block",
            script: id.toString(),
        };

        return this.restService.remData<BlockUserResponse>(params);
    }

    getFinalyFriendState(state: FriendStateDTO): keyof FriendStateDTO {
        return state.isYourBanned
            ? "isYourBanned"
            : state.isBlocked
            ? "isBlocked"
            : state.isFriend
            ? "isFriend"
            : state.isOffered
            ? "isOffered"
            : state.canFriendOffer
            ? "canFriendOffer"
            : null;
    }

    canSendMessage(state: FriendStateDTO): boolean {
        if (state.cantMessageMe) return false;

        if (state.isBlocked || state.isYourBanned) {
            return false;
        } else if (state.isFriend) {
            return true;
        }

        return false;
    }

    refresh() {
        this._updaterFriendList.next();
    }
}
