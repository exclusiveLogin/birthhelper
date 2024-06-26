import { Component, OnInit } from "@angular/core";
import { User } from "@models/user.interface";

@Component({
    selector: "app-profile-friends",
    templateUrl: "./profile-friends.component.html",
    styleUrls: ["./profile-friends.component.scss"],
})
export class ProfileFriendsComponent implements OnInit {
    mockUser = new User({
        id: 1,
        first_name: "Test",
        last_name: "Rest",
        login: "Admin",
    });

    constructor() {}

    ngOnInit(): void {}
}
