import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponentModule } from 'src/app/shared/form/form-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { OfficesComponent } from './offices.component';
import { OfficesRoutingModule } from './offices-routing.module';
import { SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [
    OfficesListComponent,
    OfficesComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    OfficesRoutingModule,
    NgxPaginationModule,
    DropdownMenusModule,
    FormComponentModule
  ]
})
export class OfficesModule { }
