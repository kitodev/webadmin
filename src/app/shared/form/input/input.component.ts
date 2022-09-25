import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'form-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit {
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
  @Input() formGroup: FormGroup;
  @Input() type: 'text';
  @Input() label?: string;
  @Input() name: string;
  @Input() autocomplete: 'on';
  @Input() required: boolean;
  control: FormControl;

  ngOnInit(): void {
    this.control = 
    this.formGroup.controls[this.name] as FormControl;
    if(this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}
