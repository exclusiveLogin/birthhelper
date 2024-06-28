import { Injectable } from "@angular/core";
import {
    Friend,
    FriendsRequestDTO,
    FriendStateDTO,
    GetFriends,
} from "@models/friend.interface";
import { OkPacket } from "@models/order.interface";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { ISettingsParams, RestService } from "@services/rest.service";
import { map, pluck, switchMap, tap } from "rxjs/operators";
import { AuthService } from "@modules/auth-module/auth.service";

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
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
        };
        this.myFriends$ = merge(this._updaterFriendList).pipe(
            switchMap(() =>
                this.restService.fetchData<FriendsRequestDTO>(params)
            ),
            map(
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
                            (friend) =>
                                new Friend(
                                    friend,
                                    this.restService,
                                    this.authService.user.id
                                )
                        ),
                        banned: banned.map(
                            (friend) =>
                                new Friend(
                                    friend,
                                    this.restService,
                                    this.authService.user.id
                                )
                        ),
                        offered: offered.map(
                            (friend) =>
                                new Friend(
                                    friend,
                                    this.restService,
                                    this.authService.user.id
                                )
                        ),
                        pending: pending.map(
                            (friend) =>
                                new Friend(
                                    friend,
                                    this.restService,
                                    this.authService.user.id
                                )
                        ),
                        blacklist: blacklist.map(
                            (friend) =>
                                new Friend(
                                    friend,
                                    this.restService,
                                    this.authService.user.id
                                )
                        ),
                    };
                }
            ),
            tap((_) => console.log("myFriends$ data: ", _))
        );
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

    getFriedsByUserId(userId: number): Friend[] {
        return;
    }

    sendFriendship(userId: number) {
        return;
    }

    revokeFriendship(id: number): { success: boolean; result: OkPacket } {
        return null;
    }

    acceptUserFriendship(id: number): { success: boolean; result: OkPacket } {
        return;
    }

    removeFriendship(id: number): { success: boolean; result: OkPacket } {
        return null;
    }

    checkFriendship(friendshipId: number): Observable<FriendStateDTO> {
        const params: ISettingsParams = {
            mode: "api",
            segment: "friends",
            resource: "check",
            script: friendshipId.toString(),
        };

        return this.restService.fetchData(params);
    }

    getBlockedUsersByUserId(userId: number): Friend[] {
        return;
    }

    blockUserByUserId(userId: number): {
        success: boolean;
        id: number;
        userId: number;
    } {
        return;
    }

    unblockUserByOfferId(id: number): {
        success: boolean;
        id: number;
        userId: number;
    } {
        return;
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
}
