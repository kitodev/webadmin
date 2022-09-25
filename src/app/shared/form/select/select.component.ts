import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormSelectItem } from '../FormSelectItem';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  
  get formGroup(): FormGroup {
    return this._formGroup;
  }

  @Input() 
  set formGroup(value: FormGroup) {
    if(!value) {
      return
    }
    
    this.control = 
    this.formGroup.controls[this.name] as FormControl;
    if(this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
  
  private _formGroup: FormGroup;
  @Input() optArray: Array<FormSelectItem<any>>;
  @Input() label?: string;
  @Input() name: string;

  @Input() required: boolean;
  get disabled(): boolean {
    return this._disabled;
  }

  @Input() 
  set disabled(value: boolean) {
    this._disabled = value;
    if(value) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }
  
  private _disabled = false;
  control: FormControl;
}
