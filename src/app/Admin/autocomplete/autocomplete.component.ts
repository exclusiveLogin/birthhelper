import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(()=>AutocompleteComponent),
    multi: true
  }]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {

  registerOnChange(fn){
    this.onChange = fn;
  }

  registerOnTouched(fn){
    this.onTouched = fn;
  }

  writeValue( value: any ){
    this.onChange(value);
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};

  @Input() dict: string;

  constructor() { }

  ngOnInit() {

  }

}
