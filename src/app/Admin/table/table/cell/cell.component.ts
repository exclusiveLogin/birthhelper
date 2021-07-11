import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import {DictService} from '../../../dict.service';
import {Observable, of, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {ITableItem} from 'app/Admin/table/table/table.component';

export interface IRowSetting {
  key: string;
  title: string;
  type?: string;
  useDict?: boolean;
  dctKey?: string;
  titleFn?: (any) => Observable<string>;
  titleDictKey?: string;
}

export interface IColumn {
  title: string;
  key: string;
}

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit, OnChanges {

  @Input() rs: IRowSetting[] = [];
  @Input() data: ITableItem;
  @Input() modes: string[];
  @Output() private remove: EventEmitter<null> = new EventEmitter();

  public cols: Observable<string[]>;

  constructor( private dictService: DictService) { }

  private converter( data ): Observable<string[]> {
    const rows$ = this.rs.map(rs => rs.titleFn ? rs.titleFn(data[rs.key]) : of(data[rs.key]));
    const obs = forkJoin(...rows$);
    return obs;
  }

  ngOnInit() {
    this.rerender();
  }

  ngOnChanges( sc: SimpleChanges ) {
    this.rerender();
  }

  public rerender() {
    if (this.data?.data && this.rs) {
      this.rs
        .filter(rs => !rs.titleFn && (rs.useDict && rs.dctKey))
        .forEach(rs => rs.titleFn =
          (itemId) => this.dictService.getDict(rs.dctKey)
            .pipe(
              map(dictItems => {

                if (!dictItems) { return null; }

                const targetDI = dictItems.find(i => i.id === itemId);
                return targetDI ? (rs.titleDictKey ?  targetDI[rs.titleDictKey] : targetDI.title) : null;
              })
            )
        );
      this.cols = this.converter(this.data.data);
    }
  }

  public removeMe() {
    this.remove.emit();
  }

  public get hasRemoveMode() {
    return this.modes && this.modes.some(m => m === 'remove');
  }

}
