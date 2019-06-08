import { Component, OnInit, Input } from '@angular/core';
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

  public rows:IRow[]=[];

  constructor() { }

  private converter( data ){
    return this.rowSetting.map( rs => rs.titleFn ? rs.titleFn(data[rs.key]) : data[rs.key]);
  }

  ngOnInit() {
    if(this.data && this.rowSetting) this.rows = this.converter(this.data);
  }

}
