import { Component, OnInit } from "@angular/core";
import { User } from "@models/user.interface";

@Component({
    selector: "app-chat-page",
    templateUrl: "./chat-page.component.html",
    styleUrls: ["./chat-page.component.scss"],
})
export class ChatPageComponent implements OnInit {
    constructor() {}

    mockUser = new User({
        id: 1,
        first_name: "Test",
        last_name: "Rest",
        login: "Admin",
    });

    ngOnInit(): void {}
}
