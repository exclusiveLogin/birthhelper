import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    @ViewChild('file') private fileRef: ElementRef;

    constructor() {
    }

    ngOnInit(): void {
    }

    uploadAvatarHandler(): void {
        this.fileRef.nativeElement.click();
    }

    upload(ev): void {
        console.log('Ready to load', ev);
    }


}
