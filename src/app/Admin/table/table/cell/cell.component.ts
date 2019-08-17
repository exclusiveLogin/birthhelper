import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEntityItem } from '../../../entity.service';
import { IDictItem } from '../../../dict.service';

export interface IRowSetting{
  key: string,
  title: string,
  type?: string,
  titleFn?: (any) => string,
}

export interface IRow{
  title: string,
  key: string
}

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input('rs') private rowSetting: IRowSetting[] = [];
  @Input('data') private data: IEntityItem | IDictItem;
  @Input('modes') private modes: string[];

  @Output('remove') private remove: EventEmitter<null> = new EventEmitter();

  public rows:IRow[]=[];

  constructor() { }

  private converter( data ){
    return this.rowSetting.map( rs => rs.titleFn ? rs.titleFn(data[rs.key]) : data[rs.key]);
  }

  ngOnInit() {
    if(this.data && this.rowSetting) this.rows = this.converter(this.data);
  }

  public removeMe(){
    this.remove.emit();
  }

  public get hasRemoveMode(){
    return this.modes && this.modes.some(m => m === 'remove');
  }

}
