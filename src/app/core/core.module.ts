import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LbFetchPipe } from './pipes/lb-fetch.pipe';



@NgModule({
  declarations: [
    LbFetchPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LbFetchPipe,
  ]
})
export class CoreModule { }
