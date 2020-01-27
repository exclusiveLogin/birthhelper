import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EntityService} from '../../../../entity.service';
import {filter} from 'rxjs/operators';

export interface IImage {
  id: number,
  url: string,
  title: string,
  description: string;
  datetime_create: string;
  datetime_update: string;
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnChanges {

  constructor(
    private entityService: EntityService
  ) { }

  @Input('id') id: number;
  public image: IImage;

  ngOnInit() {

  }

  rerender() {
    if (this.id) this.entityService.getImage(this.id).pipe(
      filter(img => !!img)
    ).subscribe( (image: IImage) => this.image = image );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.rerender();
  }

}
