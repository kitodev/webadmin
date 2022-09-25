import { CityPipe } from 'src/app/core/pipe/countypipe.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../core/services/searchfilter.pipe';
import { CKEditorModule } from 'ckeditor4-angular';
import { CountyPipe } from '../core/pipe/country.pipe';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [
    //SubscriberComponent
    CountyPipe,
    CityPipe,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    TableModule,
    DropdownModule,
  ],
  exports: [
    DialogModule,
    ButtonModule,
    CountyPipe,
    CityPipe,
    CKEditorModule,
    FilterPipe,
    TableModule,
    DropdownModule,
  ]
})
export class SharedModule { }
