import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() label?: string;
  @Input() name: string;
  @Input() required: boolean;

  control: FormControl;

  ngOnInit(): void {
    this.control = this.formGroup.controls[this.name] as FormControl;
  }
}
