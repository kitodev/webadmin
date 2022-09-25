import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';


@NgModule({
  declarations: [
    InputComponent,
    CheckboxComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule

  ],
  exports: [
    InputComponent,
    CheckboxComponent,
    SelectComponent
  ]
})
export class FormComponentModule { }
