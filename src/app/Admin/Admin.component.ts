import { Component, OnInit } from '@angular/core';
import { DictService } from './dict.service';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-Admin',
  templateUrl: './Admin.component.html',
  styleUrls: ['./Admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor( 
    private dct: DictService,
    private loader: LoaderService, 
    ) { }

  ngOnInit() {

  }

  public get isLoading(): boolean{
    return this.loader.state;
  }

  public get isError(): boolean{
    return this.loader.error;
  }
}
