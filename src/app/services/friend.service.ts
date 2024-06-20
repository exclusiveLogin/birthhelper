import { Injectable } from "@angular/core";
import { Banned, Friend, FriendStateDTO } from "@models/friend.interface";
import { OkPacket } from "@models/order.interface";
import { Observable } from "rxjs";
import {
    IRestParams,
    ISettingsParams,
    RestService,
} from "@services/rest.service";

@Injectable({
    providedIn: "root",
})
export class FriendService {
    constructor(private restService: RestService) {}

    getMyFriends(): Friend[] {
        return;
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

    getMyBlockedUsers(): Banned[] {
        return;
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
