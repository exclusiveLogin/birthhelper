import { Component, OnInit } from '@angular/core';
import { IFieldSetting } from '../../form.service';

@Component({
  selector: 'app-Services',
  templateUrl: './Services.component.html',
  styleUrls: ['./Services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor() { }

  public fields: IFieldSetting[] = [
      {
        id: 'title',
        type: 'string',
        title: 'Название услуги'
      },
      {
        id: 'description',
        type: 'text',
        title: 'Описание услуги'
      },
      {
        id: 'category',
        type: 'select',
        useDict: true,
        title: 'Категория услуги'
      },
      {
        id: 'trimester',
        type: 'select',
        useDict: true,
        title: 'Триместер услуги'
      }
    ];

  ngOnInit() {
  }

}
