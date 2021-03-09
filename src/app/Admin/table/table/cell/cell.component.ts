import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { IEntityItem } from '../../../entity.model';
import {DictService, IDictItem} from '../../../dict.service';
import {Observable, of, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

export interface IRowSetting{
  key: string,
  title: string,
  type?: string,
  useDict?: boolean,
  dctKey?: string,
  titleFn?: (any) => Observable<string>,
  titleDictKey?: string,
}

export interface IColumn{
  title: string,
  key: string
}

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit, OnChanges {

  @Input('rs') private rowSetting: IRowSetting[] = [];
  @Input('data') private data: IEntityItem | IDictItem;
  @Input('image') public image: string;
  @Input('modes') private modes: string[];
  @Output('remove') private remove: EventEmitter<null> = new EventEmitter();

  public cols:Observable<string[]>;

  constructor( private dictService: DictService) { }

  private converter( data ): Observable<string[]>{
    let rows$ = this.rowSetting.map( rs => rs.titleFn ? rs.titleFn(data[rs.key]) : of(data[rs.key]));
    let obs = forkJoin(...rows$);
    return obs;
  }

  ngOnInit() {
    this.rerender()
  }

  ngOnChanges( sc: SimpleChanges ){
    this.rerender();
  }

  public rerender(){
    if(this.data && this.rowSetting) {
      this.rowSetting
        .filter(rs => !rs.titleFn && (rs.useDict && rs.dctKey))
        .forEach(rs => rs.titleFn =
          (itemId) => this.dictService.getDict(rs.dctKey)
            .pipe(
              map(dictItems => {

                if(!dictItems) return null;

                let targetDI = dictItems.find(i => i.id === itemId);
                return targetDI ? (rs.titleDictKey ?  targetDI[rs.titleDictKey] : targetDI.title) : null;
              })
            )
        );
      this.cols = this.converter(this.data);
    }
  }

  public removeMe(){
    this.remove.emit();
  }

  public get hasRemoveMode(){
    return this.modes && this.modes.some(m => m === 'remove');
  }

}
