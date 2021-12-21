import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EntityService} from '../../../../entity.service';
import {filter, map, tap} from 'rxjs/operators';
import {environment} from '@environments/environment';
import {FormControl} from '@angular/forms';
import {ImageService} from '../../../../../services/image.service';
import {Observable} from 'rxjs';
import {SafeUrl} from '@angular/platform-browser';

export interface IImage {
    id: number;
    file_id: number;
    title: string;
    description: string;
    datetime_update: string;
    datetime_create: string;
    _id: number;
    type: string;
    filename: string;
    aws: string;
    folder: string;
}

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnChanges {

    @Input() private id: number;
    @Input() fieldControl: FormControl;

    constructor(
        private entityService: EntityService,
        public imageService: ImageService,
    ) {
    }
    public image$: Observable<SafeUrl>;
    public image: IImage;

    ngOnInit() {

    }

    rerender() {
        if (this.id) {
            this.entityService.getFile(this.id).pipe(
                tap(image => {
                    if (!image) {
                        this.fieldControl.setValue(null);
                    }
                }),
                filter(img => !!img),
            ).subscribe((image: IImage) => {
                this.image = image;
                this.image$ = this.imageService.getImage(image);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.rerender();
    }

    public removeImage() {
        if (this.fieldControl) {
            this.fieldControl.setValue(false);
        }
    }

}
